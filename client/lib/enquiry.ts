export type SubmitEnquiryInput = {
  apiBaseUrl: string;
  fullName: string;
  phone: string;
  message: string;
  email?: string;
  course?: string;
  company?: string;
  branch?: string;
  source?: string;
};

function clean(value?: string) {
  return value?.trim() || "";
}

export async function submitEnquiry(input: SubmitEnquiryInput) {
  const apiBaseUrl = clean(input.apiBaseUrl).replace(/\/$/, "");

  if (!apiBaseUrl) {
    throw new Error("API base URL is missing.");
  }

  const payload = new FormData();

  payload.append("fullName", clean(input.fullName));
  payload.append("phone", clean(input.phone));
  payload.append("message", clean(input.message));

  const email = clean(input.email);
  const course = clean(input.course);
  const company = clean(input.company);
  const branch = clean(input.branch);
  const source = clean(input.source);

  if (email) payload.append("email", email);
  if (course) payload.append("course", course);
  if (company) payload.append("company", company);
  if (branch) payload.append("branch", branch);
  if (source) payload.append("source", source);

  const response = await fetch(`${apiBaseUrl}/enquiry`, {
    method: "POST",
    body: payload,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.message || "Failed to submit enquiry. Please try again."
    );
  }

  return result;
}
