/**
 * @deprecated useSearchChecklistOverview 사용
 * GET /api/checklists/{id} 는 이제 카드 Overview를 반환합니다.
 */
export {
  fetchChecklistOverview as fetchSearchChecklistDetail,
  useSearchChecklistOverview as useSearchChecklistDetail,
  useSearchChecklistOverview as default,
} from "@/queries/api/user/useSearchChecklistOverview"
