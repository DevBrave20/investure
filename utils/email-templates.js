import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDirectory = path.join(__dirname, "..", "investure");

const templateFiles = {
  welcomeOtp: "1_welcome_otp.html",
  passwordReset: "2_password_reset.html",
  passwordChanged: "3_password_changed.html",
  depositInitiated: "4_deposit_initiated.html",
  depositCompleted: "5_deposit_completed.html",
  depositFailed: "6_deposit_failed.html",
};

const getValue = (data, keyPath) => {
  return keyPath.split(".").reduce((value, key) => value?.[key], data);
};

const renderTemplateString = (template, data) => {
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, keyPath) => {
    const value = getValue(data, keyPath.trim());
    return value === undefined || value === null ? "" : String(value);
  });
};

const htmlToText = (html) => {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|h1|h2|h3|li|tr|br)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
};

export const renderEmailTemplate = async (templateName, data = {}) => {
  const fileName = templateFiles[templateName];
  if (!fileName) {
    throw new Error(`Unknown email template: ${templateName}`);
  }

  const templatePath = path.join(templatesDirectory, fileName);
  const template = await readFile(templatePath, "utf-8");
  const html = renderTemplateString(template, data);

  return {
    html,
    text: htmlToText(html),
  };
};
