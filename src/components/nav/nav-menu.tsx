"use client";

import React, { Fragment } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { cn } from "../../lib/utils";
import Link from "next/link";

const menuItems = [
  {
    label: "Products",
    link: "/products",
    subItems: [
      {
        label: "Product A",
        description: "Description about product A",
        link: "/products/a",
      },
      {
        label: "Product B",
        description: "Description about product A",
        link: "/products/B",
      },
    ],
  },
  {
    label: "Multisend",
    link: "/multisend",
  },
  {
    label: "verification",
    link: "/verification",
  },
  {
    label: "faq",
    link: "/faq",
  },
];

const NavMenu = () => {
  return (
    <div className="bg-nav-gradient p-4 rounded-xl uppercase">
      <NavigationMenu>
        <NavigationMenuList className="flex lg:flex-row flex-col lg:items-center lg:justify-center ">
          {menuItems.map((menu) => (
            <NavigationMenuItem key={menu.label}>
              {menu.subItems ? (
                <Fragment key={menu.label}>
                  <NavigationMenuTrigger className="uppercase">
                    {menu.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                      {menu.subItems.map((component) => (
                        <ListItem
                          key={component.label}
                          title={component.label}
                          href={component.link}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </Fragment>
              ) : (
                <Link href={menu.link} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {menu.label}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavMenu;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
