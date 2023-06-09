import SortView from '../view/sorting-view.js';
import NoPointsView from '../view/no-points-view.js';
import {RenderPosition, render} from '../framework/render.js';
import TripPointPresenter from './trip-point-presenter';
import RoutePointListView from '../view/route-point-list-view.js';
import { SortType } from '../const';
import { sorts } from '../utils/sorts';
import EditingForm from '../view/editing-form-view.js';
import { updateItem } from '../utils/util.js';
export default class TripPresenter {
  #tripContainer = null;
  #tripPointsModel = null;
  #tripPoints = null;
  #destinations = null;
  #offers = null;

  #tripPointsListComponent = new RoutePointListView();
  #noTripPointComponent = new NoPointsView();
  #sortComponent = new SortView();
  #tripPointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedTripPoints = [];


  constructor({tripContainer, tripPointsModel}) {
    this.#tripContainer = tripContainer;
    this.#tripPointsModel = tripPointsModel;
  }

  init() {
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];
    this.#destinations = [...this.#tripPointsModel.destinations];
    this.#offers = [...this.#tripPointsModel.offers];
    this.#renderBoard();
    this.#sourcedTripPoints = [...this.#tripPointsModel.tripPoints];
  }

  #handleTripPointChange = (updatedTripPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedTripPoint);
    this.#tripPointPresenter.get(updatedTripPoint.id).init(updatedTripPoint, this.#destinations, this.#offers);
  };


  #renderSort() {
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderNoTripPoints() {
    render(this.#noTripPointComponent, this.#tripContainer, RenderPosition.AFTERBEGIN );
  }

  #sortTripPoints(sortType) {
    if (sorts[sortType]) {
      this.#tripPoints.sort(sorts[sortType]);
    } else {
      this.#tripPoints = [...this.#sourcedTripPoints];
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTripPoints(sortType);
    this.#clearTripPointList();
    this.#renderTripPoints();
  };


  #handleModeChange = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };


  #renderTripPoint(tripPoint) {
    const tripPoinPresenter = new TripPointPresenter({
      tripPointList: this.#tripPointsListComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleTripPointChange
    });

    tripPoinPresenter.init(tripPoint, this.#destinations, this.#offers);
    this.#tripPointPresenter.set(tripPoint.id, tripPoinPresenter);
  }


  #renderTripPoints() {
    render(this.#tripPointsListComponent, this.#tripContainer);
    this.#tripPoints.forEach((tripPoint) => this.#renderTripPoint(tripPoint));
  }


  #renderBoard() {

    if (this.#tripPoints.length === 0) {
      this.#renderNoTripPoints();
      return;
    }
    this.#renderSort();

    render(new EditingForm({destinations: this.#destinations, offers: this.#offers, isEditForm: false}), this.#tripPointsListComponent.element);

  }

  #clearTripPointList() {
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();
    //remove(this.#sortComponent);
  }
}

