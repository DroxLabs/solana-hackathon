"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { breakTheText } from "@/utils";
import Button from "@/components/atoms/button";
import { Section } from "@/components/templates";
import { Text, Title } from "@/components/atoms";
import { ButtonSize, TextSize, TitleSize } from "@/constants";
import LOCK_BTN_LEFT_ICON from "@/assets/icons/lock-btn-left-icon.webp";
import TOKEN_VESTING_LOGO from "@/assets/logos/token-vesting-logo.webp";
import LOCK_BTN_RIGHT_ICON from "@/assets/icons/lock-btn-right-icon.webp";
import UNLOCK_BTN_LEFT_ICON from "@/assets/icons/unlock-btn-left-icon.webp";
import UNLOCK_BTN_RIGHT_ICON from "@/assets/icons/unlock-btn-right-icon.webp";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";

export default function SectionHomeHero() {
  /* MEDIA QUERIES */
  const showOnMobile = useMediaQuery({ query: "(max-width: 500px)" });

  /* STATES*/
  const lockButtonRef = useRef<HTMLDivElement>(null);
  const homeHeroLogo = useRef<HTMLImageElement>(null);
  const unlockButtonRef = useRef<HTMLDivElement>(null);
  const homeHeroTitle = useRef<HTMLHeadingElement>(null);
  const homeHeroSubtitle = useRef<HTMLParagraphElement>(null);

  const router = useRouter();

  const navigateToPage = (path: string) => {
    router.push(path);
  };

  /* animation */
  useGSAP(() => {
    if (
      homeHeroTitle.current &&
      homeHeroSubtitle.current &&
      homeHeroLogo.current
    ) {
      const timeline = gsap.timeline();

      breakTheText(homeHeroTitle.current);
      const homeHeroTitleSpans = homeHeroTitle.current.querySelectorAll("span");

      // Define animation properties
      const animation = {
        header: {
          target: ".__header__ img, .__header__ div",
          props: {
            y: -50,
            opacity: 0,
            delay: 0.5,
            duration: 0.5,
            stagger: 0.3,
          },
        },
        logo: {
          target: homeHeroLogo.current,
          props: { x: -60, opacity: 0, duration: 0.5 },
        },
        title: {
          target: homeHeroTitleSpans,
          props: { opacity: 0, y: 50, stagger: 0 },
        },
        subtitle: {
          target: homeHeroSubtitle.current,
          props: { x: -60, opacity: 0, duration: 0.6 },
        },
        lockButton: {
          target: lockButtonRef.current,
          props: { x: -60, opacity: 0, duration: 0.8 },
        },
        unlockButton: {
          target: unlockButtonRef.current,
          props: { x: 60, opacity: 0, duration: 0.8 },
        },
      };

      // Add animation to timeline
      timeline.from(animation.header.target, animation.header.props);
      timeline.from(animation.logo.target, animation.logo.props, "-=0.5");
      timeline.fromTo(animation.title.target, animation.title.props, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.1,
      });
      timeline.from(
        animation.subtitle.target,
        animation.subtitle.props,
        "-=0.5"
      );
      timeline.from(
        animation.lockButton.target,
        animation.lockButton.props,
        "homeHeroButtonsAnimation"
      );
      timeline.from(
        animation.unlockButton.target,
        animation.unlockButton.props,
        "homeHeroButtonsAnimation"
      );
    }
  });

  return (
    <Section className="__home-hero__ relative flex flex-col items-center pt-[70px]">
      <Image
        alt=""
        loading="lazy"
        ref={homeHeroLogo}
        src={TOKEN_VESTING_LOGO}
        className="w-[118px] h-[135px]"
      />
      <Title
        ref={homeHeroTitle}
        size={showOnMobile ? TitleSize.H3 : TitleSize.H1}
        title="TOKEN VESTING"
        className="uppercase text-center text-transparent bg-clip-text font-bold from-blue-to-lightblue text-shadow mt-[33.5px]"
      />
      <Text
        ref={homeHeroSubtitle}
        size={TextSize.LARGE}
        className="lg:w-[50%] md:w-[70%] sm:w-[80%] max-sm:w-[90%] text-center opacity-80 mt-[23px]"
        text="A free, open source vesting program to meet all your SPL token vesting needs. easily manage the locking and distribution of your valuable tokens with token vesting contract."
      />

      <div className="btn-layout w-full flex justify-center item-center gap-12 mt-[70px] max-sm:flex-col">
        {/* Lock Tokens */}
        <div
          ref={lockButtonRef}
          className="btn__lock-tokens flex items-center max-sm:justify-center"
          onClick={() => navigateToPage("/lock-tokens")}
        >
          <Image
            src={LOCK_BTN_LEFT_ICON}
            alt=""
            loading="lazy"
            className="w-[14px] h-[58px]"
          />
          <Button
            size={ButtonSize.LARGE}
            text="Lock Tokens"
            className="uppercase font-[600] bg-[#0C7498] border border-[#0C7498]"
          />
          <Image
            src={LOCK_BTN_RIGHT_ICON}
            alt=""
            loading="lazy"
            className="w-[14px] h-[58px]"
          />
        </div>

        {/* Unlock Tokens */}
        <div
          ref={unlockButtonRef}
          className="btn__unlock-tokens flex items-center max-sm:justify-center"
          onClick={() => navigateToPage("/unlock-tokens")}
        >
          <Image
            src={UNLOCK_BTN_LEFT_ICON}
            alt=""
            loading="lazy"
            className="w-[14px] h-[56px]"
          />
          <Button
            size={ButtonSize.LARGE}
            text="Unlock Tokens"
            className="uppercase font-[600] bg-[#4BBEE6] border border-[#4BBEE6]"
          />
          <Image
            src={UNLOCK_BTN_RIGHT_ICON}
            alt=""
            loading="lazy"
            className="w-[14px] h-[56px]"
          />
        </div>
      </div>

      {/* <Image
        src={GLOWING_VECTORS_ICON}
        alt=""
        className="w-[600px] absolute left-0 top-[7%] translate-x-[-50%]"
        style={{
          zIndex: -1,
        }}
      />

      <Image
        src={GLOWING_VECTORS_ICON}
        alt=""
        className="w-[600px] z-[-1px] absolute right-0 -top-[20%] translate-x-[50%]"
        style={{
          zIndex: -1,
        }}
      /> */}
    </Section>
  );
}
