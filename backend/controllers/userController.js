import User from "../models/User.js";

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// Block or unblock user (Admin only)
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;  // toggle block/unblock
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      data: { id: user._id, isBlocked: user.isBlocked },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update block status" });
  }
};