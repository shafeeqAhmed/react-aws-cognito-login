// @flow
import React from "react";
import { Motion, spring } from "react-motion";

type Props = {|
  className?: string,
  progress?: number
|};

const SoundWave = (props: Props) => {
  const progress = typeof props.progress === "number" ? props.progress : 100;

  return (
    <div className={props.className}>
      <Motion
        defaultStyle={{ offset: 100 }}
        style={{ offset: spring(progress) }}
      >
        {(interpolation: { offset: number }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="26"
            viewBox="0 0 50 26"
          >
            <defs>
              <linearGradient id="playing" y2="0%" x2="100%" y1="0%" x1="0%">
                <stop stopColor="#0093EE" offset="0%" id="start" />
                <stop
                  stopColor="#0093EE"
                  offset={`${Math.ceil(interpolation.offset)}%`}
                  id="played"
                />
                <stop
                  stopColor="#DAE0E5"
                  offset={`${Math.ceil(interpolation.offset)}%`}
                  id="unplayed"
                />
                <stop stopColor="#DAE0E5" offset="100%" id="end" />
              </linearGradient>
            </defs>
            <g
              fill="none"
              fillRule="evenodd"
              stroke="url('#playing')"
              strokeLinecap="round"
            >
              <path d="M1 13.074h47.902M7.483 9.687v6.555M14.623 9.687v6.555M39.03 8.68v8.628M42.517 10.129v5.709M28.57 7.26v11.496M11.136 6.228V19.73M18.11 3.389v19.377M31.89 6.228V19.73M25.083 3.389v19.377M21.596 1.06v23.857M35.377 4.73v16.638" />
            </g>
          </svg>
        )}
      </Motion>
    </div>
  );
};

SoundWave.defaultProps = {
  className: "",
  progress: 100
};

export default SoundWave;
