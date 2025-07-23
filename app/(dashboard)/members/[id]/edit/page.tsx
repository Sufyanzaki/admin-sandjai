"use client";

import {Button} from "@/components/ui/button";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import PersonalInfoTab from "@/app/(dashboard)/members/_components/PersonalInfoTab";
import ProfessionalTab from "@/app/(dashboard)/members/_components/ProfessionalTab";
import BehaviorTab from "@/app/(dashboard)/members/_components/BehaviorTab";
import PartnerTab from "@/app/(dashboard)/members/_components/PartnerTab";
import LifeStyleTab from "@/app/(dashboard)/members/_components/LifeStyleTab";
import HobbiesTab from "@/app/(dashboard)/members/_components/HobbiesTab";
import LanguagesTab from "@/app/(dashboard)/members/_components/LanguagesTab";
import LivingTab from "@/app/(dashboard)/members/_components/LivingTab";
import AboutMeTab from "@/app/(dashboard)/members/_components/AboutMeTab";

export default function EditMemberPage() {

  return (
    <div className="flex flex-col gap-5 p-4 xl:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/members">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Edit Member</h1>
          <p className="text-muted-foreground">Update profile details, preferences, and personal information for this member.</p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Basic Information</TabsTrigger>
          <TabsTrigger value="professional">Education & Career</TabsTrigger>
          <TabsTrigger value="behavior">Personality & Behavior</TabsTrigger>
          <TabsTrigger value="patner">Partner Expectation</TabsTrigger>
          <TabsTrigger value="life_style">Life Style</TabsTrigger>
          <TabsTrigger value="hobbies">Hobbies & Interest</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="living">Living</TabsTrigger>
          <TabsTrigger value="about_me">About Me</TabsTrigger>
        </TabsList>
        <PersonalInfoTab />
        <ProfessionalTab />
        <BehaviorTab />
        <PartnerTab />
        <LifeStyleTab />
        <HobbiesTab />
        <LanguagesTab />
        <LivingTab />
        <AboutMeTab />
      </Tabs>
    </div>
  );
}
