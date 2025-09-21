function validateEmail(email) {

  if (!email.includes("@")) {
    return false;
  }

  const parts = email.split("@");
  const local = parts[0];
  const domain = parts[1];

  if (!local || !domain) {
    return false; 
  }

  for (let ch of local) {
    if (
      !(
        (ch >= "a" && ch <= "z") ||
        (ch >= "A" && ch <= "Z") ||
        (ch >= "0" && ch <= "9") ||
        ch === "." ||
        ch === "_" ||
        ch === "-"
      )
    ) {
      return false;
    }
  }

  if (!domain.includes(".")) {
    return false;
  }

  const domainParts = domain.split(".");
  const tld = domainParts.pop();

  for (let part of domainParts) {
    for (let ch of part) {
      if (
        !(
          (ch >= "a" && ch <= "z") ||
          (ch >= "A" && ch <= "Z") ||
          (ch >= "0" && ch <= "9") ||
          ch === "." ||
          ch === "-"
        )
      ) {
        return false;
      }
    }
  }

  if (tld.length < 2) {
    return false;
  }
  for (let ch of tld) {
    if (!((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))) {
      return false; 
    }
  }

  return true; 
}

module.exports = { validateEmail };

// function validateEmail(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// module.exports = { validateEmail };