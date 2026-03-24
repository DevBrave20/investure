import mailGen from "mailgen";

const mailGenerator = new mailGen({
  theme: "default", // Using a more modern theme
  product: {
    name: "Quantumtrade",
    logo: "https://www.Quantumtrade.com/BigLogo.png",
    link: "https://www.Quantumtradehq.com", // Fixed the typo in the URL
    copyright: "Copyright © 2025 Quantumtrade. All rights reserved.",
    logoHeight: "50px",
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
    social: {
      facebook: "https://facebook.com/Quantumtrade",
      twitter: "https://twitter.com/Quantumtrade",
      linkedin: "https://linkedin.com/company/Quantumtrade"
    }
  }
});

export default mailGenerator;
