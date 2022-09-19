import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './ExpansionPanelModern.scss';
import { useSelector, useDispatch } from 'react-redux';

export default function ExpansionPanelModern({
  description,
  subcategory,
  financial_category,
  children,
  ...props
}) {
  const data = props.data;
  const { categories } = useSelector(({ dashboard }) => dashboard);
  const currentCateory =
    categories &&
    categories.find((el) => el.id === data.subcategory) &&
    categories.find((el) => el.id === data.subcategory).name;
  return (
    <div className="expansion_modern">
      <ExpansionPanel className="expansion_panel">
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="head">
          <div className="table_row">{children}</div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="body">
          <div className="info_wrapper">
            <div className="expansion_row">
              <div className="expansion__elem category">
                <span className="expansion__elem_title">Category</span>
                <p className="expansion__elem_text">{currentCateory}</p>
              </div>
              <div className="expansion__elem fincategory">
                <span className="expansion__elem_title">Financing category</span>
                <p className="expansion__elem_text">
                  {data.financial_category === 'equipment'
                    ? 'Hospital Equipment'
                    : data.financial_category === 'consumable'
                    ? 'Hospital Consumables'
                    : data.financial_category === 'pharmacy'
                    ? 'Pharmacy (B2C) Products'
                    : 'Category not specified'}
                </p>
              </div>
            </div>
            <div className="expansion_row">
              {!data.description ? (
                <div>There are no additional notes</div>
              ) : (
                <>
                  <span className="expansion__elem_title">Description</span>

                  <p
                    className="expansion__elem_text"
                    dangerouslySetInnerHTML={{
                      __html: data.description,
                    }}
                  />
                </>
              )}
            </div>
            {/*<p className="no_info">{message}</p>*/}
          </div>
          <div />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
