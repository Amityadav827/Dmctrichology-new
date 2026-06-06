const axios = require("axios");

const buildTelecrmPayload = ({ name, mobile, source }) => {
  const phoneField = process.env.TELECRM_PHONE_FIELD || "phone";
  const nameField = process.env.TELECRM_NAME_FIELD || "name";
  const sourceField = process.env.TELECRM_SOURCE_FIELD || "source";

  return {
    fields: {
      [phoneField]: mobile,
      [nameField]: name,
      [sourceField]: source || "Homepage Lead Form"
    }
  };
};

const sendLeadToTelecrm = async ({ name, mobile, source }) => {
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

  const { data } = await axios.post(
    endpoint,
    buildTelecrmPayload({ name, mobile, source }),
    {
      headers: {
        "Content-Type": "application/json",
        [authHeader]: authValue
      },
      timeout: Number(process.env.TELECRM_TIMEOUT_MS || 10000)
    }
  );

  return data;
};

module.exports = {
  sendLeadToTelecrm
};
