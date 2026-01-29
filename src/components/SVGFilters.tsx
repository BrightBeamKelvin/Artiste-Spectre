export const SVGFilters = () => {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        {/* Red channel filter */}
        <filter id="redChannel">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>
        
        {/* Green channel filter */}
        <filter id="greenChannel">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>
        
        {/* Blue channel filter */}
        <filter id="blueChannel">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />
        </filter>

        {/* Datamosh displacement filter */}
        <filter id="datamosh">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.01" 
            numOctaves="1" 
            result="noise"
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="3" 
            xChannelSelector="R" 
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};
