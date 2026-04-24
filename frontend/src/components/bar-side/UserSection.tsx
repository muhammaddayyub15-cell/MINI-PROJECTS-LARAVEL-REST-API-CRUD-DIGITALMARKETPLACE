type Props = {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  onLogin?: () => void;
};

function UserSection({
  isLoggedIn,
  name,
  email,
  avatarUrl,
  onLogout,
  onLogin,
}: Props) {
  return (
    <div className="p-4 border-t border-gray-700 flex flex-col gap-3">
      
      {isLoggedIn ? (
        <>
          {/* USER INFO */}
          <div className="flex items-center gap-3">
            
            {/* AVATAR */}
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* TEXT */}
            <div className="overflow-hidden">
              <div className="font-semibold text-sm truncate">
                {name}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {email}
              </div>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={onLogout}
            className="
              w-full mt-1 py-2 rounded-md
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              transition
            "
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={onLogin}
          className="
            w-full py-2 rounded-md
            bg-red-600 hover:bg-red-700
            text-white font-semibold
            transition
          "
        >
          Login
        </button>
      )}

    </div>
  );
}

export default UserSection;