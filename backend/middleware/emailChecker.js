function countAtSings(email) {
  let count = 0;
  for (let ch of email) {
    if (ch === "@") {
      count++;
    }
  }
  return count;
}

function splitEmail(email) {
  return email.split("@");
}

function checklocalPart(local) {
  if (local.length === 0) return false;
  for (let ch of local) {
    if (!((ch >= "a" && ch <= "z") ||(ch >= "A" && ch <= "Z") ||(ch >= "0" && ch <= "9") 
        ||ch === "." ||ch === "_" ||ch === "-")) {
      return false;
    }
  }
  return true;
}

function checkDomainPart(domain) {
  if (!domain || !domain.includes(".")) return false;

  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;

  const TopLevelDomain = domainParts.pop();
  if (TopLevelDomain.length < 2) return false;
  for (let ch of TopLevelDomain) {
    if (!((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))) {
      return false;
    }
  }

  for (let part of domainParts) {
    if (part.length === 0) return false;
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

  return true;
}

function hasConsecutiveDots(str) {
  for (let i = 0; i < str.length - 1; i++) {
    if (str[i] === "." && str[i + 1] === ".") {
      return true;
    }
  }
  return false;
}

function isValidEmail(email) {
  if (countAtSings(email) !== 1) {
    return false;
  }

  const [local, domain] = splitEmail(email);
  if (!checklocalPart(local)) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (hasConsecutiveDots(local)) return false;
  if (!checkDomainPart(domain)) return false;
  return true; 
}

module.exports = { isValidEmail};
