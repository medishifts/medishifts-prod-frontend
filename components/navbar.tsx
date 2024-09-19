"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";

import NextLink from "next/link";
import clsx from "clsx";
import ReactLoading from "react-loading";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import LoginModal from "./LoginModal";
import pb from "@/utils/pocketbase-connect";
import { getCookie } from "cookies-next";
import { AppDispatch, useAppSelector } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { resetProfile } from "@/app/redux/features/profile-slice";
import { FaBell } from "react-icons/fa";

interface User {
  name: string;
}

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const name = useAppSelector((state) => state.profileReducer.value.name);
  const role = useAppSelector((state) => state.profileReducer.value.role);
  const authData = getCookie("authData");
  const data = authData ? JSON.parse(authData as string) : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  function extractFirstName(fullName: string) {
    // Use a regular expression to match and extract the first name
    const match = fullName.match(/(?:Dr\.?\s*)?(\w+)\s+\w+/);
    return match ? match[1] : fullName;
  }
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await pb.authStore.clear();
    dispatch(resetProfile());
    setUser(null);
    setLoading(false);
    window.location.href = "/";
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = pb.authStore.model;
      if (auth && typeof auth === "object" && "name" in auth) {
        setUser({ name: auth.name });
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((auth) => {
      if (auth) {
        setUser({ name: auth });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <ReactLoading type="spin" color="#ffffff" height={100} width={100} />
        </div>
      )}

      <NextUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-1 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo />
              <p className="font-bold text-inherit">Medishifts.in</p>
            </NextLink>
          </NavbarBrand>
          {/* <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul> */}
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            {user && name ? (
              <div className="flex gap-x-2">
                <FaBell size={24} color="#FF5733" />

                <div className="relative" ref={dropdownRef}>
                  <span
                    className="rounded-lg text-center mt-2 text-sm font-bold cursor-pointer px-4 py-2 transition-all duration-300 ease-in-out"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      backgroundColor: dropdownOpen
                        ? "rgba(229, 231, 235, 1)"
                        : "rgba(31, 41, 55, 1)",
                      color: dropdownOpen ? "#1F2937" : "#E5E7EB",
                    }}
                  >
                    {name}
                  </span>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-25 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
                      <ul className="py-2">
                        <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                          <button
                            className="w-full text-left"
                            onClick={() => {
                              if (role === "HOSPITAL") {
                                window.location.href = "/hospital_Dashboard";
                              } else if (role === "DOCTOR") {
                                window.location.href = "/doctor-dashboard";
                              } else if (role === "NURSE") {
                                window.location.href = "/nurse-dashboard";
                              }
                            }}
                          >
                            Profile
                          </button>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                          <button
                            className="w-full text-left"
                            onClick={handleSignOut}
                          >
                            Sign out
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Button
                className="text-sm font-normal text-default-600 bg-default-100"
                onClick={handleModalOpen}
                variant="flat"
              >
                Sign in | Sign up
              </Button>
            )}
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pr-2" justify="end">
          {name ? (
            <div className="flex items-center ">
              <FaBell size={24} color="#FF5733" />

              <span className="rounded-lg text-center mt-2 text-sm font-bold cursor-pointer px-4 py-2 transition-all duration-300 ease-in-out">
                {extractFirstName(name)}
              </span>
            </div>
          ) : (
            <Button
              className="text-sm font-normal text-default-600 bg-default-100"
              onClick={handleModalOpen}
              variant="flat"
            >
              Sign in | Sign up
            </Button>
          )}
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {/* {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={
                    index === 2
                      ? "primary"
                      : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                  }
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))} */}
            {user && (
              <div className="flex flex-col gap-2">
                <NavbarMenuItem>
                  <Button
                    className="text-sm font-normal text-default-600 bg-default-100"
                    onClick={handleSignOut}
                    variant="flat"
                  >
                    Sign out
                  </Button>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Button
                    className="text-sm font-normal text-default-600 bg-default-100"
                    onClick={() => {
                      if (role === "HOSPITAL") {
                        window.location.href = "/hospital_Dashboard";
                      } else if (role === "DOCTOR") {
                        window.location.href = "/doctor-dashboard";
                      } else if (role === "NURSE") {
                        window.location.href = "/nurse-dashboard";
                      }
                    }}
                  >
                    Profile
                  </Button>
                </NavbarMenuItem>
              </div>
            )}
          </div>
        </NavbarMenu>
      </NextUINavbar>

      <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
};
