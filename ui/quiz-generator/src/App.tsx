// src/App.tsx
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, Outlet } from "react-router";

function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  return (
    <div className="min-h-full bg-gray-50">
      <Disclosure as="nav" className="border-b border-gray-200 bg-white">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                {/* Logo / title */}
                <div className="flex">
                  <div className="flex shrink-0 items-center">
                    <span className="text-lg font-semibold tracking-tight text-indigo-700">
                      Quiz Builder
                    </span>
                  </div>

                  {/* Desktop nav */}
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    <NavLink
                      to="/"
                      end
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "border-indigo-600 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                        )
                      }
                    >
                      Home
                    </NavLink>

                    <NavLink
                      to="/quizzes"
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "border-indigo-600 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                        )
                      }
                    >
                      Show Quiz
                    </NavLink>

                    <NavLink
                      to="/create-quiz"
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "border-indigo-600 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                        )
                      }
                    >
                      Add Quiz
                    </NavLink>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="-mr-2 flex items-center sm:hidden">
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600">
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon
                      aria-hidden="true"
                      className={classNames(!open && "block", "size-6 group-data-open:hidden")}
                    />
                    <XMarkIcon
                      aria-hidden="true"
                      className={classNames(open && "block", "hidden size-6 group-data-open:block")}
                    />
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* Mobile nav */}
            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-3">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                      "block border-l-4 py-2 pr-4 pl-3 text-base font-medium"
                    )
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/solve-quiz"
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                      "block border-l-4 py-2 pr-4 pl-3 text-base font-medium"
                    )
                  }
                >
                  Show Quiz
                </NavLink>

                <NavLink
                  to="/create-quiz"
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                      "block border-l-4 py-2 pr-4 pl-3 text-base font-medium"
                    )
                  }
                >
                  Add Quiz
                </NavLink>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {/* Main layout content */}
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Tu wchodzi konkretna strona */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
