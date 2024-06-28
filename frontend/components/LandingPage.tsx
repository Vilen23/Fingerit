"use client";
import React, { useEffect } from "react";
import { LoginPage } from "./LoginPage";

export const LandingPage = () => {
  useEffect(() => {
    window.location.href = "/practise";
  }, []);
  return <div></div>;
};
