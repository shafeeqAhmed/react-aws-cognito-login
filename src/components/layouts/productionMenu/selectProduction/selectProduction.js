// @flow
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import defaultImage from "static/images/movie_cover.png";
import css from "./selectProduction.style.css";
import type { ReduxProps } from "./";

type Props = ReduxProps & {};

export default class SelectProduction extends PureComponent<Props> {
  selectProduction = (productionId: number) => {
    this.props.selectProduction(productionId);
  };

  renderProductions = (): any =>
    this.props.productions.map((production: any) => {
      const image = production.poster ? (
        <img
          alt="production"
          src={production.poster && production.poster.urls[0]}
          onError={e => {
            e.target.src = defaultImage;
          }}
          className={css.poster}
        />
      ) : (
        <div className={css.noPoster} />
      );

      return (
        <Link
          className={css.production}
          key={production.id}
          onClick={() => this.selectProduction(production.id)}
          to={`/${production.id}/drive`}
        >
          <div className={css.prodInfo}>
            {image}
            {production.name}
          </div>
          {this.props.activeProductionID === production.id && (
            <i className={`material-icons ${css.checkIcon}`}>check</i>
          )}
        </Link>
      );
    });

  render() {
    return (
      <div className={css.container}>
        <div className={css.divider}>PRODUCTIONS</div>
        <div className={css.productions}>{this.renderProductions()}</div>
        <div className={css.production}>
          Suspended Productions
          <i className="material-icons">chevron_right</i>
        </div>
      </div>
    );
  }
}
