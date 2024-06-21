"use client"
import TypingComponent from '@/components/GameText'
import MakeRoom from '@/components/MakeRoom';
import { preferenceAtom } from '@/states/atoms/preference'
import React from 'react'
import { useRecoilValue } from 'recoil'

export default function page() {
  const preference = useRecoilValue(preferenceAtom);
  console.log(preference)
  return (
    <div>
      {(preference.mode === "challenge") ? (<MakeRoom />) : <TypingComponent />}
    </div>
  )
}
