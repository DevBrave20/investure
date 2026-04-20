import mailGen from "mailgen";

const mailGenerator = new mailGen({
  theme: "default", // Using a more modern theme
  product: {
    name: "investure",
    logo: "https://www.investure.com/BigLogo.png",
    link: "https://www.investurehq.com", // Fixed the typo in the URL
    copyright: "Copyright © 2025 investure. All rights reserved.",
    logoHeight: "50px",
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
    social: {
      facebook: "https://facebook.com/investure",
      twitter: "https://twitter.com/investure",
      linkedin: "https://linkedin.com/company/investure"
    }
  }
});

export default mailGenerator;
