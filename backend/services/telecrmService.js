const axios = require("axios");

const LOCATION_MATCHERS = [
  {
    label: "Vasant Vihar",
    fullAddress: "A2/6, Block A, Vasant Vihar, New Delhi, Delhi 110057, India"
  },
  {
    label: "Rajouri Garden",
    fullAddress: "J-12/25, 1st Floor, Block J, Rajouri Garden Extension, Rajouri Garden, New Delhi, Delhi, 110027, India"
  }
];

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

const findLocationByText = (text) => {
  const value = cleanString(text);
  if (!value) return "";

  const lowered = value.toLowerCase();
  const matched = LOCATION_MATCHERS.find((location) => {
    return lowered.includes(location.label.toLowerCase()) || lowered.includes(location.fullAddress.toLowerCase());
  });

  return matched ? matched.fullAddress : "";
};

const extractPreferredLocation = ({
  preferredLocation,
  location,
  service,
  enquiryType,
  message
} = {}) => {
  return (
    findLocationByText(preferredLocation) ||
    findLocationByText(location) ||
    findLocationByText(service) ||
    findLocationByText(enquiryType) ||
    findLocationByText(message)
  );
};

const buildTelecrmPayload = ({
  name,
  mobile,
  source,
  preferredLocation,
  email,
  service,
  message
}) => {
  const phoneField = process.env.TELECRM_PHONE_FIELD || "phone";
  const nameField = process.env.TELECRM_NAME_FIELD || "name";
  const sourceField = process.env.TELECRM_SOURCE_FIELD || "source";
  const locationField = process.env.TELECRM_LOCATION_FIELD || "location";
  const emailField = cleanString(process.env.TELECRM_EMAIL_FIELD);
  const serviceField = cleanString(process.env.TELECRM_SERVICE_FIELD);
  const messageField = cleanString(process.env.TELECRM_MESSAGE_FIELD);

  const normalizedLocation = extractPreferredLocation({
    preferredLocation,
    service,
    message
  });

  const fields = {
    [phoneField]: cleanString(mobile),
    [nameField]: cleanString(name),
    [sourceField]: cleanString(source) || "Homepage Lead Form"
  };

  if (normalizedLocation) {
    fields[locationField] = normalizedLocation;
  }
  if (emailField && cleanString(email) && !cleanString(email).endsWith("@no-email.dmc-trichology.local")) {
    fields[emailField] = cleanString(email);
  }
  if (serviceField && cleanString(service)) {
    fields[serviceField] = cleanString(service);
  }
  if (messageField && cleanString(message)) {
    fields[messageField] = cleanString(message);
  }

  return {
    fields,
    normalizedLocation
  };
};

const sendLeadToTelecrm = async ({
  name,
  mobile,
  source,
  preferredLocation,
  email,
  service,
  message
}) => {
  const endpoint = process.env.TELECRM_ENDPOINT;
  const accessToken = process.env.TELECRM_ACCESS_TOKEN;

  if (!endpoint || !accessToken) {
    return {
      skipped: true,
      reason: "TeleCRM endpoint or access token is not configured"
    };
  }

  const authHeader = process.env.TELECRM_AUTH_HEADER || "Authorization";
  const authValue = process.env.TELECRM_AUTH_PREFIX === "none"
    ? accessToken
    : `${process.env.TELECRM_AUTH_PREFIX || "Bearer"} ${accessToken}`;

  const { fields, normalizedLocation } = buildTelecrmPayload({
    name,
    mobile,
    source,
    preferredLocation,
    email,
    service,
    message
  });

  const response = await axios.post(
    endpoint,
    { fields },
    {
      headers: {
        "Content-Type": "application/json",
        [authHeader]: authValue
      },
      timeout: Number(process.env.TELECRM_TIMEOUT_MS || 10000)
    }
  );

  return {
    status: response.status,
    data: response.data,
    payload: { fields },
    normalizedLocation
  };
};

const syncLeadToTelecrm = async (leadData, logLabel = "Lead") => {
  try {
    const result = await sendLeadToTelecrm(leadData);
    if (result.skipped) {
      console.warn(`[TeleCRM] ${logLabel} skipped: ${result.reason}`);
      return result;
    }

    console.log(`[TeleCRM] ${logLabel} synced successfully`, {
      status: result.status,
      source: cleanString(leadData?.source) || "unknown",
      location: result.normalizedLocation || null
    });
    return result;
  } catch (error) {
    console.error(
      `[TeleCRM] ${logLabel} sync failed:`,
      error.response?.status || "",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = {
  extractPreferredLocation,
  sendLeadToTelecrm,
  syncLeadToTelecrm
};
