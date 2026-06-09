const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'terms_conditions';

const defaultContent = `<p>Set out below are the terms and conditions which DMC Trichology trades upon and offers its services to its patients.</p>
<p>Please ensure that you have read and fully understood the terms and conditions prior to booking any treatment.</p>
<h3>Appointments and Cancellations</h3>
<p>All Skin experts, and therapists at DMC Trichology are trained and approved in accordance with the clinic's treatment protocols. If you are unable to attend your appointment, please contact us immediately at +91-8527830194, +91-9810939319</p>
<p>We will need to know that you wish to cancel your appointment at least 24 hours in advance. Failure to cancel or re-schedule before 24 hours, will result in the loss of the treatment, and all discounted offers and your deposit/advance shall be liable to be forfeited by DMC Trichology</p>
<p>Please arrive for your appointment at least 10 minutes in advance so that the necessary paperwork can be completed. We will endeavour to ensure that your appointment runs on time; however, should we need to cancel or postpone your appointment at short notice, due to unavoidable circumstances, we will make every effort to contact you in advance.</p>
<h3>Information Collected</h3>
<p>We may collect the following information: Personal data of the User such as, but not limited to, your name, age, gender; e-mail and contact information alongwith the message (to specify concern of query).</p>
<h3>E-mail, SMS &amp; Telephone Calls</h3>
<p>From time to time, DMC Trichology will contact you and send you information related to your health records, services you are currently availing and offers ongoing in the clinic. We will be sending e-mails and / or SMSes at the e-mail id(s) and contact mobile number(s) provided by you. We will also be making calls on the phone numbers provided by you. By using our services and providing us the above contact details on our &ldquo;Book Appointment/Contact us&rdquo; form at the time of registration, you have authorised us to contact you by any of the communication modes mentioned above. In case you have given a wrong e-mail id or mobile / phone number for correspondence, Clinic will not be responsible for the loss of information or privacy due to the message going to an unknown destination.</p>
<p>We may use a third-party vendor to help us manage some of our e-mail and SMS communications with you. While we may supply this vendor with e-mail addresses and mobile numbers of those we wish them to contact, your e-mail address or mobile number is never used for any purpose other than to communicate with you on our behalf. When you click on a link on our Website or in an e-mail sent by us, you may be temporarily redirected through one of the vendor&rsquo;s servers (although this process will be invisible to you) which will register that you&rsquo;ve clicked on that link. Our Clinic never shares any information, other than your e-mail address, with our third-party e-mail vendor, and they in turn do not share these e-mail addresses with anyone else.</p>
<h3>Call &amp; IP Logs</h3>
<p>We maintain standard call and recording logs that record data about all visitors and customers who call us and/or access our Application. We store this information for providing services and as an analysis tool for our management. All call logs and recordings are stored securely, and may only be accessed by Clinic employees or designees on a need-to-know basis for a specific purpose. Clinic uses call log information to help provide our members the efficient services under this membership.</p>
<h3>Course and Treatment Plans</h3>
<p>When Course or Treatment Plan is booked, it is done on the understanding that the client will complete the duration of the treatment plan. DMC Trichology will not be held responsible for patients changing their minds and we will not offer any type of refund on these plans, unless with exceptional circumstances where the client is found to be unsuitable due to health reasons.</p>
<p>These charges will not be applied to patients booking an appointment from their existing value package of treatment.</p>
<h3>Treatment suitability</h3>
<p>We will always assess whether treatment is suitable for you, or likely to be successful, prior to any treatment being carried out. If not, we will inform you as to the reasons why. You will only be liable for the cost of the initial consultation, where applicable.</p>
<h3>Liability</h3>
<p>DMC Trichology will not be liable in contract, tort or otherwise for any economic loss (including, without limitation, loss of profit), or for any other special, indirect or consequential loss or damage arising out of, or in connection with, its provision of any services to the patients.</p>
<p>It is the patient's responsibility to ensure that he or she provides DMC Trichology with all relevant medical details prior to each treatment. We will not be liable for any damage that occurs as a result of the client's failure to disclose such details.</p>
<p>The patient agrees to comply with all instructions and/or recommendations given to them by, or on behalf of, DMC Trichology regarding the care of a treated area. Nothing in these terms of business shall exclude or limit DMC Trichology liability for death or any personal injury resulting from the patient's negligence.</p>
<h3>Your right to complain</h3>
<p>DMC Trichology endeavors to treat all its patients appropriately, compassionately and fairly. If, however, you have an issue with any matter in relation to your treatment at DMC Trichology, you are entitled to lodge a complaint verbally, by telephone or in writing. If you require assistance with making your complaint, DMC Trichology, will be pleased to help. During the course of the investigation, DMC Trichology may require you to attend an additional consultation with the practitioner involved in your treatment, if this is deemed appropriate. If you are not satisfied with this initial attempt at resolution or have any objection to being seen by this practitioner, the clinic's Directors will review your case.</p>
<h3>RETURN, REFUND AND CANCELLATION POLICY</h3>
<p>DMC Trichology does not entertain Return, Refund and Cancellation in any circumstances.</p>
<p>If you have any queries regarding our Terms and Conditions, please mail us at: <a href="mailto:info@dadumedicalcentre.com">info@dadumedicalcentre.com</a></p>`;

const fallbackData = {
  hero: {
    isEnabled: true,
    pageTitle: 'Terms & Conditions',
    breadcrumbLabel: 'Terms & Conditions',
    backgroundImage: ''
  },
  content: defaultContent,
  seo: {
    metaTitle: 'Terms & Conditions | DMC Trichology',
    metaDescription: 'Read the terms and conditions on which DMC Trichology offers its services, including appointments, cancellations, liability and refund policy.',
    ogImage: ''
  }
};

function normalizePayload(data = {}) {
  return {
    hero: {
      isEnabled: data.hero?.isEnabled !== false,
      pageTitle: data.hero?.pageTitle || fallbackData.hero.pageTitle,
      breadcrumbLabel: data.hero?.breadcrumbLabel || fallbackData.hero.breadcrumbLabel,
      backgroundImage: data.hero?.backgroundImage || ''
    },
    content: typeof data.content === 'string' && data.content.trim() ? data.content : fallbackData.content,
    seo: {
      metaTitle: data.seo?.metaTitle || fallbackData.seo.metaTitle,
      metaDescription: data.seo?.metaDescription || fallbackData.seo.metaDescription,
      ogImage: data.seo?.ogImage || ''
    }
  };
}

exports.getSettings = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections')
      .select('data')
      .eq('key', CMS_KEY)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return res.status(200).json({
      success: true,
      data: normalizePayload(row?.data || fallbackData),
      isFallback: !row
    });
  } catch (error) {
    console.error('Error fetching Terms & Conditions settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const payload = normalizePayload(req.body || fallbackData);

    const { error } = await supabase
      .from('cms_sections')
      .upsert({ key: CMS_KEY, data: payload, updated_at: new Date() }, { onConflict: 'key' });

    if (error) throw error;

    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    console.error('Error updating Terms & Conditions settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = await uploadToSupabase(req.file, 'terms_conditions_assets');
    return res.status(200).json({ success: true, url });
  } catch (error) {
    console.error('Error uploading Terms & Conditions image:', error);
    return res.status(500).json({ success: false, message: 'Server error uploading image' });
  }
};
