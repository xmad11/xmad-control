"use client";

import React, { memo, useMemo, type ComponentProps, type CSSProperties } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useAudioVisualizerGridAnimator, type AgentState, type Coordinate } from "./hooks/use-audio-visualizer";

export const AudioVisualizerGridCellVariants = cva(
  [
    "rounded-full transition-all ease-out",
    "bg-white/15",
    "data-[highlighted=true]:bg-cyan-400 data-[highlighted=true]:shadow-[0_0_8px_rgba(34,211,238,0.5)]",
  ],
  {
    variants: {
      size: {
        icon: "w-[2px] h-[2px]",
        sm: "w-[4px] h-[4px]",
        md: "w-[8px] h-[8px]",
        lg: "w-[10px] h-[10px]",
        xl: "w-[14px] h-[14px]",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export const AudioVisualizerGridVariants = cva(
  "grid place-items-center rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-3",
  {
    variants: {
      size: {
        icon: "gap-[2px]",
        sm: "gap-[3px]",
        md: "gap-[4px]",
        lg: "gap-[5px]",
        xl: "gap-[6px]",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export interface GridOptions {
  radius?: number;
  interval?: number;
  rowCount?: number;
  columnCount?: number;
  className?: string;
}

const sizeDefaults = {
  icon: 3,
  sm: 5,
  md: 7,
  lg: 9,
  xl: 11,
};

interface GridCellProps {
  index: number;
  state: AgentState;
  rowCount: number;
  columnCount: number;
  highlightedCoordinate: Coordinate;
  size: "icon" | "sm" | "md" | "lg" | "xl";
}

const GridCell = memo(function GridCell({
  index,
  columnCount,
  highlightedCoordinate,
  size,
}: GridCellProps) {
  const isHighlighted =
    highlightedCoordinate.x === index % columnCount &&
    highlightedCoordinate.y === Math.floor(index / columnCount);

  return (
    <div
      data-index={index}
      data-highlighted={isHighlighted}
      className={cn(AudioVisualizerGridCellVariants({ size }))}
    />
  );
});

export type AudioVisualizerGridProps = GridOptions & {
  size?: "icon" | "sm" | "md" | "lg" | "xl";
  state?: AgentState;
  color?: string;
  className?: string;
};

export function AudioVisualizerGrid({
  size = "md",
  state = "connecting",
  color = "#22d3ee",
  rowCount: _rowCount,
  columnCount: _columnCount,
  interval = 100,
  radius,
  className,
  style,
  ...props
}: AudioVisualizerGridProps & ComponentProps<"div">) {
  const defaultCount = sizeDefaults[size];
  const columnCount = _columnCount ?? defaultCount;
  const rowCount = _rowCount ?? defaultCount;

  const items = useMemo(
    () => new Array(columnCount * rowCount).fill(0).map((_, idx) => idx),
    [columnCount, rowCount]
  );

  const highlightedCoordinate = useAudioVisualizerGridAnimator(
    state,
    rowCount,
    columnCount,
    interval,
    radius
  );

  return (
    <div
      data-state={state}
      className={cn(AudioVisualizerGridVariants({ size }), className)}
      style={
        {
          ...style,
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          color,
        } as CSSProperties
      }
      {...props}
    >
      {items.map((idx) => (
        <GridCell
          key={idx}
          index={idx}
          state={state}
          rowCount={rowCount}
          columnCount={columnCount}
          highlightedCoordinate={highlightedCoordinate}
          size={size}
        />
      ))}
    </div>
  );
}
