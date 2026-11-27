"use client"

import styled from "styled-components"

type Props = {
    sections: { key: string; title: string }[]
    activeKey: string
    onSelect: (key: string) => void
}

const AnalysisReportNav = ({ sections, activeKey, onSelect }: Props) => {
    return (
        <Nav>
            {sections.map((section) => (
                <NavItem
                    key={section.key}
                    type="button"
                    $active={activeKey === section.key}
                    onClick={() => onSelect(section.key)}
                >
                    {section.title}
                </NavItem>
               ))}
           </Nav>
        )
    }

const Nav = styled.nav`
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 120px;
  padding: 16px 12px;
  border-right: 1px solid rgb(var(--color-neutral500));
`

const NavItem = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: 4px;
  text-align: left;
  font-size: ${(props) => props.theme.typo.size.sm};
  line-height: ${(props) => props.theme.typo.leading.sm};
  color: ${(props) => (props.$active ? "rgb(var(--color-primary600))" : "rgb(var(--color-neutral800))")};
  background: ${(props) => (props.$active ? "rgba(22, 119, 255, 0.08)" : "transparent")};
  cursor: pointer;
`

export default AnalysisReportNav