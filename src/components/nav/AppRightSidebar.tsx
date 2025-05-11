import { cn } from "@/lib/utils";
import { DB_User } from "@/app/actions/user.action";
import SuggestedUser from "@/components/SuggestedUser";

async function AppRightSidebar({ dbUser }: { dbUser: DB_User }) {
  if (!dbUser) return null;

  return (
    <aside
      className={cn(
        "col-span-2 max-lg:hidden"
        // pathname.includes("/messages") && "hidden"
      )}
    >
      <div className="sticky top-6 space-y-4">
        <SuggestedUser />

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Help Center
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Cookie Policy
            </a>
            <a href="#" className="hover:underline">
              Accessibility
            </a>
          </div>
          <p>
            {new Date().getFullYear()} Created by{" "}
            <a
              href="https://github.com/Mmm44556"
              target="_blank"
              className="hover:underline"
            >
              Mmm44556
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}

export default AppRightSidebar;
