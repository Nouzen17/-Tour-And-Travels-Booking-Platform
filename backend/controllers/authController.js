if (user.isBlocked) {
  return res.status(403).json({ success: false, message: "Account is blocked. Contact admin." });
}