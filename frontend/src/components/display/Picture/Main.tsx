"use client"

import { useEffect, useState } from "react"
import Image, { ImageProps } from "next/image"
import styled, { css } from "styled-components"
import { NonUndefined, isEquals } from "@/libs/utils"
import Icon, { TypeIconName } from "@/components/general/Icon"
import { PictureRounded } from "@/components/display/Picture/type"

export interface PictureMainProps extends ImageProps {
  alt: string
  ratio?: [number, number]
  rounded?: PictureRounded
  src: string
  fallbackText?: string
  fallbackIcon?: TypeIconName
  className?: string
  onLoad?: React.ReactEventHandler<HTMLImageElement>
  onError?: React.ReactEventHandler<HTMLImageElement>
}

interface TypeStructure {
  src: string | null
  isLoaded: boolean
  isErrored: boolean
}

const PictureMain = (props: PictureMainProps) => {
  const {
    alt,
    ratio,
    rounded = PictureRounded.NONE,
    src,
    fallbackText,
    fallbackIcon = "Picture",
    className = "",
    onLoad,
    onError,
    ...restProps
  } = props

  const [structure, setStructure] = useState<TypeStructure>({
    src: src ?? null,
    isLoaded: false,
    isErrored: false,
  })

  useEffect(() => {
    setStructure((prev) => ({
      ...prev,
      isLoaded: false,
      isErrored: false,
      src: src ?? null,
    }))
  }, [src])

  if (!structure.src || structure.isErrored) {
    return (
      <PictureMainContainer className={`${className}`} $ratio={ratio ?? [1, 1]} $rounded={rounded} $isFallback={true}>
        {fallbackText ? <span>{fallbackText}</span> : <Icon name={fallbackIcon} aria-hidden={true} />}
      </PictureMainContainer>
    )
  }

  return (
    <PictureMainContainer className={`${className}`} $ratio={ratio ?? [0, 0]} $rounded={rounded} $isFallback={false}>
      <Image
        fill={true}
        alt={alt}
        sizes="100%"
        src={structure.src}
        onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
          setStructure((prev) => ({ ...prev, isLoaded: true }))
          onLoad?.(event)
        }}
        onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
          setStructure((prev) => ({ ...prev, isErrored: true, src: null }))
          onError?.(event)
        }}
        {...restProps}
      />
    </PictureMainContainer>
  )
}

interface PictureMainStyled {
  $ratio: NonUndefined<PictureMainProps["ratio"]>
  $rounded: NonUndefined<PictureMainProps["rounded"]>
  $isFallback: boolean
}

const PictureImage = css`
  position: relative;
  width: 100%;
  overflow: hidden;
`

const PictureFallback = css`
  position: relative;
  width: 100%;
  color: rgb(var(--color-neutral800));
  overflow: hidden;
  background: rgb(var(--color-neutral300));
  span,
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
  }
  span {
    display: block;
    width: 100%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    transform: translate(-50%, -50%) scale(0.85);
  }
  svg {
    width: 50%;
    height: 50%;
    transform: translate(-50%, -50%);
  }
`

const PictureMainContainer = styled.div<PictureMainStyled>`
  ${(props) => {
    if (props.$ratio && !isEquals(props.$ratio, [0, 0]))
      return css`
        img {
          position: absolute !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
        }
        &:before {
          content: "";
          display: block;
          padding-top: ${(props.$ratio[1] / props.$ratio[0]) * 100}%;
        }
      `
    return css`
      img {
        position: relative !important;
        width: 100% !important;
        height: auto !important;
      }
      &:before {
        content: none;
      }
    `
  }}
  ${(props) => {
    switch (props.$isFallback) {
      case false:
        return PictureImage
      case true:
      default:
        return PictureFallback
    }
  }}
  ${(props) => {
    switch (props.$rounded) {
      case PictureRounded.FULL:
        return css`
          border-radius: ${props.$ratio && !isEquals(props.$ratio, [0, 0]) ? "50%" : "9999px"};
        `
      case PictureRounded.NONE:
      default:
        return css`{
          border-radius: 0px;
        }`
    }
  }}
`

export default PictureMain
