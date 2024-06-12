"use client";
import React, { type ReactNode } from "react";
import { type EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import { PrevButton, NextButton, usePrevNextButtons } from "./EmblaCarouselArrowButtons";

type PropType = {
	slides: ReactNode[];
	options?: EmblaOptionsType;
	withControls?: boolean;
};

export const Carousel: React.FC<PropType> = ({ slides, options, withControls = false }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(options);

	const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

	const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
		usePrevNextButtons(emblaApi);

	return (
		<div className="embla">
			<div className="embla__viewport" ref={emblaRef}>
				<div className="embla__container">
					{slides.map((slide, index) => (
						<div
							className="embla__slide embla__class-names grid h-96 grid-rows-2"
							key={index}
						>
							{slide}
						</div>
					))}
				</div>
			</div>

			{withControls && (
				<div className="embla__controls">
					<div className="embla__buttons">
						<PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
						<NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
					</div>

					<div className="embla__dots">
						{scrollSnaps.map((_, index) => (
							<DotButton
								key={index}
								onClick={() => onDotButtonClick(index)}
								className={"embla__dot".concat(
									index === selectedIndex ? " embla__dot--selected" : "",
								)}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
