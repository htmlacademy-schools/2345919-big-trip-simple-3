import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {render} from './framework/render.js';
import NewTripPointButtonView from './view/new-trip-point-button.js';
import TripPresenter from './presenter/presenter.js';
import TripPointModel from './model/point-model.js';
import { mockInit } from './mock/util.js';
import { offersByType } from './mock/const.js';

const eventsTemplate = document.querySelector('.trip-events');
const filtersTemlate = document.querySelector('.trip-controls__filters');
const siteHeaderElement = document.querySelector('.trip-main');


const [tripPoints, destinations] = mockInit(5, 10);
const tripPointsModel = new TripPointModel(tripPoints);
const destinationsModel = new DestinationsModel(destinations);
const offersModel = new OffersModel(offersByType);
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({boardContainer: eventsTemplate,
  tripPointsModel, destinationsModel, offersModel, filterModel, onNewTripPointDestroy: handleNewTripPointFormClose});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersTemlate,
  filterModel,
  tripPointsModel
});

const newTripPointButtonComponent = new NewTripPointButtonView({
  onClick: handleNewTripPointButtonClick
});

function handleNewTripPointFormClose() {
  newTripPointButtonComponent.element.disabled = false;
}


function handleNewTripPointButtonClick() {
  tripPresenter.createTripPoint();
  newTripPointButtonComponent.element.disabled = true;
}
render(newTripPointButtonComponent, siteHeaderElement);
filterPresenter.init();
tripPresenter.init();

