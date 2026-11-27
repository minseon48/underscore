import { FieldValues } from "react-hook-form"

export const TypeSupportRegion = {
  All: "All",
  Nationwide: "전국",
  Seoul: "서울",
  Busan: "부산",
  Daegu: "대구",
  Incheon: "인천",
  Gwangju: "광주",
  Daejeon: "대전",
  Ulsan: "울산",
  Sejong: "세종",
  Gyeonggi: "경기",
  Gangwon: "강원",
  Chungbuk: "충북",
  Chungnam: "충남",
  Jeonbuk: "전북",
  Jeonnam: "전남",
  Gyeongbuk: "경북",
  Gyeongnam: "경남",
  Jeju: "제주",
} as const

export type TypeSupportRegion = (typeof TypeSupportRegion)[keyof typeof TypeSupportRegion]

export const SupportRegionOptionGroups = [
  {
    label: "지역",
    options: Object.entries(TypeSupportRegion).map(([, value]) => ({
      value: value as TypeSupportRegion,
      text: value === "All" ? "전체" : value,
    })),
  },
]

export const TypeRecruitmentStatus = {
  All: "All",
  Y: "Y",
  N: "N",
  S: "S",
} as const

export type TypeRecruitmentStatus = (typeof TypeRecruitmentStatus)[keyof typeof TypeRecruitmentStatus]

export const RecruitmentStatusOptionGroups = [
  {
    label: "모집 진행여부",
    options: [
      { value: TypeRecruitmentStatus.All as TypeRecruitmentStatus, text: "전체" },
      { value: TypeRecruitmentStatus.Y as TypeRecruitmentStatus, text: "모집중" },
      { value: TypeRecruitmentStatus.S as TypeRecruitmentStatus, text: "모집예정" },
      { value: TypeRecruitmentStatus.N as TypeRecruitmentStatus, text: "마감" },
    ],
  },
]

export interface TypeSearchSupport extends FieldValues {
      page: number
      size: number
      isFiltered: boolean
      startDate?: Date
      endDate?: Date
      region: TypeSupportRegion
      recruitmentStatus: TypeRecruitmentStatus
      searchStartDate?: Date
      searchEndDate?: Date
      searchRegion: TypeSupportRegion
      searchRecruitmentStatus: TypeRecruitmentStatus

    }