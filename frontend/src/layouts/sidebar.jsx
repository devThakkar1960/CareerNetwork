import { forwardRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { navbarLinks } from "../constants/index";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import { toast } from "sonner"; // ✅ Toast import

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    toast.success("Admin logout successful"); 
    navigate("/");
    window.location.reload();
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white transition-all dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      <div className="flex gap-x-3 p-3">
        {!collapsed && (
          <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">
            CareerNetwork
          </p>
        )}
      </div>
      <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 scrollbar-thin">
        {navbarLinks.map((navbarLink) => (
          <nav
            key={navbarLink.title}
            className={cn("sidebar-group", collapsed && "md:items-center")}
          >
            <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>
              {navbarLink.title}
            </p>
            {navbarLink.links.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
              >
                <link.icon size={22} className="flex-shrink-0" />
                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
              </NavLink>
            ))}
          </nav>
        ))}
      </div>
      <div className="mt-auto p-3">
        <button
          onClick={handleLogout}
          className="w-full rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};
