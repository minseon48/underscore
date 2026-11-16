import { TypeRecruitmentStatus, TypeSupportRegion } from "@/components/form/SearchSupport"

export type TypeSupportListAllId = number
export type TypeSupportListAllFilter = {
    size: number
    startDate?: Date
    endDate?: Date
    region: TypeSupportRegion
    recruitmentStatus: TypeRecruitmentStatus
}

export const supportKey = {
    list: {
        all: (page: TypeSupportListAllId, filter: TypeSupportListAllFilter) => [page, filter],
        },
    }