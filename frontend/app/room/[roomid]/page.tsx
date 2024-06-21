"use client"
import GameText from '@/components/GameText'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function () {
  const session = useSession();

  return (
    <div>
      <GameText />
    </div>
  )
}

