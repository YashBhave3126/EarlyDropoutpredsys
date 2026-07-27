/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface SplitWordsProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

/**
 * SplitWords
 *
 * Renders plain text as a sequence of masked word spans so that
 * useScrollReveal's [data-reveal-words] handler can animate each
 * word rising into place (like a subtitle/caption reveal) as the
 * headline scrolls into view. Only use for plain strings — if a
 * heading needs nested styled spans/line breaks, use data-reveal
 * on the whole block instead.
 */
export default function SplitWords({ text, className, as: Tag = "span" }: SplitWordsProps) {
  const words = text.split(" ");

  return (
    <Tag data-reveal-words className={className}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden align-top pb-1">
            <span data-word className="inline-block will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
}
