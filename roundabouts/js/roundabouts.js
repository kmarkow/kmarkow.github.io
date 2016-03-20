(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CellsDrawer = (function () {
    function CellsDrawer(roundaboutSpecification, cellsMap, unitConverter, two, translator) {
        _classCallCheck(this, CellsDrawer);

        this._cellsMap = cellsMap;
        this._unitConverter = unitConverter;
        this._roundaboutSpecification = roundaboutSpecification;
        this._two = two;
        this._centerPoint = {
            x: this._two.width / 2,
            y: this._two.height / 2
        };
        this._cellsMap.registerObserver(this);
        this._drawnCells = [];
        this._cellLengthPx = this._unitConverter.cellsAsPixels(1);
        this._translator = translator;
    }

    /**
     * Handle change in cellsMap and refresh view.
     * Implements observer Pattern.
     */

    _createClass(CellsDrawer, [{
        key: "notify",
        value: function notify() {
            this.draw();
        }
    }, {
        key: "draw",
        value: function draw() {
            this._clearDrawnElements();
            this._drawRoundaboutGrid();
            this._drawAdherentRoadsGrid();
        }
    }, {
        key: "_clearDrawnElements",
        value: function _clearDrawnElements() {
            this._two.remove(this._drawnCells);
        }
    }, {
        key: "_drawRoundaboutGrid",
        value: function _drawRoundaboutGrid() {
            var _this = this;

            var cellWidthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.laneWidth());

            this._roundaboutSpecification.innerRoadLanes().forEach(function (lane) {
                var laneRadiusPx = _this._unitConverter.metersAsPixels(_this._roundaboutSpecification.laneRadius(lane.id()));
                var cellsCount = _this._unitConverter.metersAsCells(lane.length());
                _this._cellsMap.cellsOnLane(lane.id()).forEach(function (cell, cellIndex) {
                    var pct = cellsCount - cellIndex / cellsCount;
                    var theta = pct * Math.PI * 2;
                    var x = laneRadiusPx * Math.cos(theta);
                    var y = laneRadiusPx * Math.sin(theta);
                    var singleCell = _this._two.makeRectangle(_this._centerPoint.x + x, _this._centerPoint.y + y, _this._cellLengthPx, cellWidthPx);
                    singleCell.rotation = Math.atan2(-y, -x) + Math.PI / 2;
                    _this._drawStrokeIfDebug(singleCell);
                    _this._cellFillColor(cell, singleCell);
                    _this._drawnCells.push(singleCell);
                });
            });
        }
    }, {
        key: "_cellFillColor",
        value: function _cellFillColor(cell, cellElement) {
            if (!cell.isEmpty()) {
                cellElement.fill = "#" + cell.vehicle().id().toString(16);
                cellElement.stroke = "#FF0000";
            } else {
                cellElement.fill = "transparent";
            }
        }
    }, {
        key: "_drawStrokeIfDebug",
        value: function _drawStrokeIfDebug(cellElement) {
            if (document.getElementById("debug_on").checked) {
                cellElement.stroke = "#FF0000";
            } else {
                cellElement.noStroke();
            }
        }
    }, {
        key: "_drawAdherentRoadsGrid",
        value: function _drawAdherentRoadsGrid() {
            var _this2 = this;

            this._roundaboutSpecification.adherentRoads().forEach(function (road) {
                _this2._translator.translateTo(_this2._drawAdherentRoadGrid(road), road.id());
            });
        }
    }, {
        key: "_drawAdherentRoadGrid",
        value: function _drawAdherentRoadGrid(road) {
            var _this3 = this;

            var roadWidthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.adherentRoadWidth());
            var roadLengthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.adherentRoadLength());

            var adherentLanesCount = this._roundaboutSpecification.adherentLanesCount();
            var cellsToGroup = [];
            var cellLengthPx = this._unitConverter.cellsAsPixels(1);
            var cellWidthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.adherentRoadWidth() / adherentLanesCount);

            road.allLanes().forEach(function (lane, i) {
                var cells = _this3._cellsMap.cellsOnLane(lane.id());
                if (lane.isExit()) {
                    cells = cells.slice(0).reverse();
                }

                cells.forEach(function (cell, j) {
                    var singleCell = _this3._two.makeRectangle(-roadWidthPx / adherentLanesCount + i / adherentLanesCount * roadWidthPx - cellWidthPx / 2, roadLengthPx / 2 - cellLengthPx / 2 - j * cellLengthPx, cellWidthPx, cellLengthPx);
                    _this3._drawStrokeIfDebug(singleCell);
                    _this3._cellFillColor(cell, singleCell);
                    cellsToGroup.push(singleCell);
                });
            });

            var groupedCells = this._two.makeGroup(cellsToGroup);
            this._drawnCells.push(groupedCells);
            return groupedCells;
        }
    }]);

    return CellsDrawer;
})();

exports["default"] = CellsDrawer;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RoundaboutDrawer = (function () {
    function RoundaboutDrawer(roundaboutSpecification, unitConverter, two, translator) {
        _classCallCheck(this, RoundaboutDrawer);

        this._roundaboutSpecification = roundaboutSpecification;
        this._unitConverter = unitConverter;
        this._two = two;
        this._centerPoint = {
            x: this._two.width / 2,
            y: this._two.height / 2
        };
        this._letRoadMeltIntoRoundabout = 7;
        this._translator = translator;
    }

    _createClass(RoundaboutDrawer, [{
        key: "draw",
        value: function draw() {
            this._drawAdherentRoads();
            this._drawRoundaboutRoads();
            this._drawRoundaboutBrokenLanes();
            this._drawIsland();
        }
    }, {
        key: "_drawRoundaboutRoads",
        value: function _drawRoundaboutRoads() {
            var roundaboutRadiusPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.roundaboutRadius());
            var background = this._two.makeCircle(this._centerPoint.x, this._centerPoint.y, roundaboutRadiusPx);
            background.fill = "#000000";
        }
    }, {
        key: "_drawRoundaboutBrokenLanes",
        value: function _drawRoundaboutBrokenLanes() {
            for (var i = 1; i < this._roundaboutSpecification.lanesCount(); i++) {
                var laneRadius = this._roundaboutSpecification.roundaboutRadius() - this._roundaboutSpecification.laneWidth() * i;
                var laneRadiusPx = this._unitConverter.metersAsPixels(laneRadius);
                var brokenLinesCount = laneRadius * 4; // It could be anything else but 4 looks cool

                for (var j = 0; j < brokenLinesCount; j++) {
                    var pct = j / brokenLinesCount;
                    var theta = pct * Math.PI * 2;
                    var x = laneRadiusPx * Math.cos(theta);
                    var y = laneRadiusPx * Math.sin(theta);

                    var singleLine = this._two.makeRectangle(this._centerPoint.x + x, this._centerPoint.y + y, 5, 1);
                    singleLine.noStroke();
                    singleLine.fill = "#FFFFFF";
                    singleLine.rotation = Math.atan2(-y, -x) + Math.PI / 2;
                }
            }
        }
    }, {
        key: "_drawIsland",
        value: function _drawIsland() {
            var islandRadiusPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.islandRadius());
            var island = this._two.makeCircle(this._centerPoint.x, this._centerPoint.y, islandRadiusPx);
            island.fill = "#00FF00";
        }
    }, {
        key: "_drawAdherentRoads",
        value: function _drawAdherentRoads() {
            this._translator.translateToSouthRoad(this._drawRoad());
            this._translator.translateToWestRoad(this._drawRoad());
            this._translator.translateToNorthRoad(this._drawRoad());
            this._translator.translateToEastRoad(this._drawRoad());
        }
    }, {
        key: "_drawRoad",
        value: function _drawRoad() {
            var roadLengthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.adherentRoadLength()) + this._letRoadMeltIntoRoundabout;
            var roadWidthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.adherentRoadWidth());

            // Create road element
            var road = this._two.makeRectangle(0, 0, roadWidthPx, roadLengthPx);
            road.fill = "#0F0F0F";

            var middleLine = this._drawContinuousLine(roadLengthPx);
            var leftLines = this._drawStraightBrokenLine(-roadWidthPx / 4, roadLengthPx);
            var rightLines = this._drawStraightBrokenLine(roadWidthPx / 4, roadLengthPx);

            var groupedElements = [road, middleLine].concat(leftLines, rightLines);

            var wholeRoad = this._two.makeGroup(groupedElements);
            return wholeRoad;
        }
    }, {
        key: "_drawStraightBrokenLine",
        value: function _drawStraightBrokenLine(xPos, lineLength) {
            var groupedElements = [];
            var linesToDraw = 16;
            var lineStartingY = -lineLength / 2;

            for (var i = 0; i < linesToDraw; i++) {
                var thisStarts = lineStartingY + i / linesToDraw * lineLength;
                var thisEnds = thisStarts + 1 / linesToDraw * lineLength;

                // Draw dotted line or continuous line on the beginning of the road
                if (i % 2 == 0 || i < 4) {
                    var brokenLine = this._two.makeLine(xPos, thisStarts, xPos, thisEnds);
                    brokenLine.stroke = "#FFFFFF";
                    groupedElements.push(brokenLine);
                }
            }
            return groupedElements;
        }
    }, {
        key: "_drawContinuousLine",
        value: function _drawContinuousLine(roadLengthPx) {
            var line = this._two.makeLine(0, 0 - roadLengthPx / 2, 0, 0 + roadLengthPx / 2);
            line.stroke = "#FFFFFF";
            return line;
        }
    }]);

    return RoundaboutDrawer;
})();

exports.RoundaboutDrawer = RoundaboutDrawer;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Translator = (function () {
    function Translator(roundaboutSpecification, unitConverter, two) {
        _classCallCheck(this, Translator);

        this._roundaboutSpecification = roundaboutSpecification;
        this._unitConverter = unitConverter;
        this._two = two;
        this._centerPoint = {
            x: this._two.width / 2,
            y: this._two.height / 2
        };

        var roadLengthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.adherentRoadLength());
        var roundaboutRadiusPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.roundaboutRadius());
        this._pixelsFromCenterToRoadCenter = roundaboutRadiusPx + roadLengthPx / 2;
    }

    _createClass(Translator, [{
        key: 'translateTo',
        value: function translateTo(elements, where) {
            if (where == 'N') {
                this.translateToNorthRoad(elements);
            } else if (where == 'S') {
                this.translateToSouthRoad(elements);
            } else if (where == 'E') {
                this.translateToEastRoad(elements);
            } else if (where == 'W') {
                this.translateToWestRoad(elements);
            } else {
                throw new Error("Unknown direction " + where);
            }
        }
    }, {
        key: 'translateToSouthRoad',
        value: function translateToSouthRoad(elements) {
            elements.translation.set(this._centerPoint.x, this._centerPoint.y + this._pixelsFromCenterToRoadCenter);
        }
    }, {
        key: 'translateToWestRoad',
        value: function translateToWestRoad(elements) {
            elements.translation.set(this._centerPoint.x - this._pixelsFromCenterToRoadCenter, this._centerPoint.y);
            elements.rotation += 1 * Math.PI / 2;
        }
    }, {
        key: 'translateToNorthRoad',
        value: function translateToNorthRoad(elements) {
            elements.translation.set(this._centerPoint.x, this._centerPoint.y - this._pixelsFromCenterToRoadCenter);
            elements.rotation += 2 * Math.PI / 2;
        }
    }, {
        key: 'translateToEastRoad',
        value: function translateToEastRoad(elements) {
            elements.translation.set(this._centerPoint.x + this._pixelsFromCenterToRoadCenter, this._centerPoint.y);
            elements.rotation += 3 * Math.PI / 2;
        }
    }]);

    return Translator;
})();

exports['default'] = Translator;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var METERS_PER_CELL = 2.5;

var UnitConverter = (function () {
    function UnitConverter(canvasInMeters, canvasInPixels) {
        _classCallCheck(this, UnitConverter);

        this.canvasInMeters = canvasInMeters;
        this.canvasInPixels = canvasInPixels;
    }

    _createClass(UnitConverter, [{
        key: "pixelsPerMeter",
        value: function pixelsPerMeter() {
            return Math.floor(this.canvasInPixels / this.canvasInMeters);
        }
    }, {
        key: "metersAsPixels",
        value: function metersAsPixels(meters) {
            return meters * this.pixelsPerMeter();
        }
    }, {
        key: "metersAsCells",
        value: function metersAsCells(meters) {
            return Math.floor(meters / METERS_PER_CELL);
        }
    }, {
        key: "cellsAsPixels",
        value: function cellsAsPixels(cells) {
            return this.metersAsPixels(cells * METERS_PER_CELL);
        }
    }]);

    return UnitConverter;
})();

exports["default"] = UnitConverter;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function range(start, count) {
    return Array.apply(0, Array(count)).map(function (element, index) {
        return index + start;
    });
}

exports.range = range;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = (function () {
    function Cell(cellId) {
        _classCallCheck(this, Cell);

        this._parentLane = null;
        this._cellId = cellId;
        this._vehicle = false;
    }

    _createClass(Cell, [{
        key: "setVehicle",
        value: function setVehicle(vehicle) {
            if (vehicle && !this.isEmpty()) {
                throw new Error("Vehicle " + vehicle.toString() + " crashed onto " + this._vehicle.toString());
            }
            this._vehicle = vehicle;
        }
    }, {
        key: "vehicle",
        value: function vehicle() {
            return this._vehicle;
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return !this._vehicle;
        }
    }, {
        key: "id",
        value: function id() {
            if (this.parentLane()) {
                return this.parentLane().id().toString() + this._cellId.toString();
            }
            throw new Error("Cannot generate id until a lane is not assigned");
        }
    }, {
        key: "assignToLane",
        value: function assignToLane(lane) {
            if (this._parentLane) {
                throw new Error("Cannot reassign cell to another lane");
            }
            this._parentLane = lane;
        }
    }, {
        key: "parentLane",
        value: function parentLane() {
            if (!this._parentLane) {
                throw new Error("Cell unassigned to lane");
            }
            return this._parentLane;
        }
    }, {
        key: "equals",
        value: function equals(anotherCell) {
            return this.id() == anotherCell.id();
        }
    }, {
        key: "number",
        value: function number() {
            return this._cellId;
        }
    }]);

    return Cell;
})();

exports["default"] = Cell;
module.exports = exports["default"];

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _JsWhyYouNoImplementJs = require('../JsWhyYouNoImplement.js');

var _CellJs = require('./Cell.js');

var _CellJs2 = _interopRequireDefault(_CellJs);

var CellsLane = (function () {
    _createClass(CellsLane, null, [{
        key: 'newLane',
        value: function newLane(laneId, lengthCells) {
            var isRounded = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            var cells = [];
            (0, _JsWhyYouNoImplementJs.range)(0, lengthCells).forEach(function (cellNumber) {
                cells.push(new _CellJs2['default'](cellNumber));
            });
            return new CellsLane(laneId, cells, isRounded);
        }
    }]);

    function CellsLane(id, cells, isRounded) {
        var _this = this;

        _classCallCheck(this, CellsLane);

        cells.forEach(function (cell) {
            cell.assignToLane(_this);
        });
        this._id = id;
        this._allCells = cells;
        this._allCellsReversed = this._allCells.slice().reverse();
        this._isRounded = isRounded;
    }

    _createClass(CellsLane, [{
        key: 'id',
        value: function id() {
            return this._id;
        }
    }, {
        key: 'cellsNextTo',
        value: function cellsNextTo(cell, limitTo) {
            return this._cellsNextTo(cell, limitTo, this._allCells);
        }
    }, {
        key: 'cellsPreviousTo',
        value: function cellsPreviousTo(cell, limitTo) {
            return this._cellsNextTo(cell, limitTo, this._allCellsReversed);
        }
    }, {
        key: 'cellsPreviousToInclusive',
        value: function cellsPreviousToInclusive(cell, limitTo) {
            return [cell].concat(this._cellsNextTo(cell, limitTo - 1, this._allCellsReversed));
        }
    }, {
        key: 'allCells',
        value: function allCells() {
            return this._allCells;
        }
    }, {
        key: '_cellsNextTo',
        value: function _cellsNextTo(cell, limitTo, arrayFrom) {
            var cellIndex = arrayFrom.findIndex(function (element) {
                return element.equals(cell);
            });
            if (cellIndex == -1) {
                throw new Error("Cell not found ", cell.id());
            }
            var nextCellIndex = cellIndex + 1;
            var nextCells = arrayFrom.slice(nextCellIndex, nextCellIndex + limitTo);
            var missingCells = limitTo - nextCells.length;

            if (this._isRounded && missingCells) {
                nextCells = nextCells.concat(arrayFrom.slice(0, missingCells));
            }
            return nextCells;
        }
    }, {
        key: 'isExitLane',
        value: function isExitLane() {
            return !this._isRounded; //TODO: Take care of entrances also
        }
    }]);

    return CellsLane;
})();

exports['default'] = CellsLane;
module.exports = exports['default'];

},{"../JsWhyYouNoImplement.js":5,"./Cell.js":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _CellJs = require('./Cell.js');

var _CellJs2 = _interopRequireDefault(_CellJs);

var _CellsLaneJs = require('./CellsLane.js');

var _CellsLaneJs2 = _interopRequireDefault(_CellsLaneJs);

var _VehicleJs = require('./Vehicle.js');

var _VehicleJs2 = _interopRequireDefault(_VehicleJs);

var _ObservableJs = require('./Observable.js');

var _ObservableJs2 = _interopRequireDefault(_ObservableJs);

var ExitRoadEnd = (function (_Error) {
    _inherits(ExitRoadEnd, _Error);

    function ExitRoadEnd(message) {
        _classCallCheck(this, ExitRoadEnd);

        _get(Object.getPrototypeOf(ExitRoadEnd.prototype), 'constructor', this).call(this, message);
        this.message = message;
        this.name = 'ExitRoadEnd';
    }

    return ExitRoadEnd;
})(Error);

var CellsMap = (function (_Observable) {
    _inherits(CellsMap, _Observable);

    function CellsMap(roundaboutSpecification, unitConverter) {
        _classCallCheck(this, CellsMap);

        _get(Object.getPrototypeOf(CellsMap.prototype), 'constructor', this).call(this);
        this._roundaboutSpecification = roundaboutSpecification;
        this._unitConverter = unitConverter;
        this._lanes = {};
        this._divideLanesToCells();
    }

    _createClass(CellsMap, [{
        key: '_divideLanesToCells',
        value: function _divideLanesToCells() {
            var _this = this;

            this._roundaboutSpecification.allLanes().forEach(function (lane) {
                _this._lanes[lane.id()] = _CellsLaneJs2['default'].newLane(lane.id(), _this._unitConverter.metersAsCells(lane.length()), lane.isRounded());
            });
        }
    }, {
        key: 'cellsOnLane',
        value: function cellsOnLane(laneNumber) {
            return this._lanes[laneNumber].allCells();
        }
    }, {
        key: 'cellsCountOnLane',
        value: function cellsCountOnLane(laneNumber) {
            return this._lanes[laneNumber].allCells().length;
        }
    }, {
        key: 'outerLaneNumber',
        value: function outerLaneNumber() {
            return this._roundaboutSpecification.lanesCount() - 1;
        }
    }, {
        key: 'moveVehicleBy',
        value: function moveVehicleBy(vehicle, cellsToMove) {
            if (cellsToMove == 0) {
                return;
            }
            var nextCells = vehicle.frontCell().parentLane().cellsNextTo(vehicle.frontCell(), cellsToMove);
            if (nextCells.length < cellsToMove && vehicle.frontCell().parentLane().isExitLane()) {
                throw new ExitRoadEnd("End of exit road");
            }
            var newVehicleFrontCell = nextCells.slice(-1)[0];
            var newVehicleCells = newVehicleFrontCell.parentLane().cellsPreviousToInclusive(newVehicleFrontCell, vehicle.lengthCells());
            var oldVehicleCells = vehicle.currentCells();
            if (newVehicleCells.length != oldVehicleCells.length) {
                //TODO: Hardcoded 2 for truck
                newVehicleCells = newVehicleCells.concat(oldVehicleCells.slice(2, 2 + oldVehicleCells.length - newVehicleCells.length));
            }
            vehicle.moveToCells(newVehicleCells);
        }
    }, {
        key: 'addVehicle',
        value: function addVehicle(vehicle) {
            var lane = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var cell = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

            var firstCell = this.cellsOnLane(lane)[cell];
            var vehicleCells = [firstCell];
            vehicleCells = vehicleCells.concat(firstCell.parentLane().cellsPreviousTo(firstCell, vehicle.lengthCells() - 1));
            vehicle.moveToCells(vehicleCells);
        }
    }, {
        key: 'nothingInFrontOf',
        value: function nothingInFrontOf(vehicle, numberOfCellsToCheck) {
            var nextCells = vehicle.frontCell().parentLane().cellsNextTo(vehicle.frontCell(), numberOfCellsToCheck);
            return nextCells.every(function (cell) {
                return cell.isEmpty();
            });
        }
    }, {
        key: 'takeExit',
        value: function takeExit(vehicle) {
            var oldVehicleCells = vehicle.currentCells();
            var sliceFrom = Math.max(0, vehicle.currentSpeed() - vehicle.lengthCells());
            var sliceTo = vehicle.currentSpeed();
            //TODO: Hardcoded EXIT_1
            var newVehicleCells = this._lanes[vehicle.destinationExit() + "_EXIT_1"].allCells().slice(sliceFrom, sliceTo).reverse();
            var newVehicleCells = newVehicleCells.concat(oldVehicleCells.slice(0, oldVehicleCells.length - newVehicleCells.length));
            vehicle.moveToCells(newVehicleCells);
        }
    }]);

    return CellsMap;
})(_ObservableJs2['default']);

exports.CellsMap = CellsMap;
exports.ExitRoadEnd = ExitRoadEnd;

},{"./Cell.js":6,"./CellsLane.js":7,"./Observable.js":11,"./Vehicle.js":17}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _CellJs = require('./Cell.js');

var _CellJs2 = _interopRequireDefault(_CellJs);

var _SpecificationDirectionJs = require('./Specification/Direction.js');

var _SpecificationDirectionJs2 = _interopRequireDefault(_SpecificationDirectionJs);

var _JsWhyYouNoImplementJs = require('../JsWhyYouNoImplement.js');

var CellsNeighbours = (function () {
    function CellsNeighbours(laneCellsCount) {
        _classCallCheck(this, CellsNeighbours);

        var roadEvery = Math.floor(laneCellsCount / 4);
        var firstRoadAt = roadEvery - 3;
        if (!laneCellsCount) {
            throw new Error("Unknown cells number");
        }
        this._exits = {
            'N': [firstRoadAt + roadEvery * 0, firstRoadAt + 1 + roadEvery * 0],
            'W': [firstRoadAt + roadEvery * 1, firstRoadAt + 1 + roadEvery * 1],
            'S': [firstRoadAt + roadEvery * 2, firstRoadAt + 1 + roadEvery * 2],
            'E': [firstRoadAt + roadEvery * 3, firstRoadAt + 1 + roadEvery * 3]
        };
    }

    _createClass(CellsNeighbours, [{
        key: 'isApproachingExit',
        value: function isApproachingExit(vehicle) {
            //TODO: Base on rules check if can leave roundabout from the lane number
            var closestDestinationExitOn = this._exits[vehicle.destinationExit()][0];
            var distanceFromExit = closestDestinationExitOn - vehicle.frontCell().number();
            var distanceTravelledIfStartsSlowingDown = (0, _JsWhyYouNoImplementJs.range)(vehicle.maxSpeedWhenTurning(), Math.max(0, vehicle.currentSpeed() - 1)).reduce(function (previousValue, currentValue) {
                return previousValue + currentValue;
            }, 0);
            if (distanceTravelledIfStartsSlowingDown >= distanceFromExit && distanceFromExit > 0) {
                return true;
            }
            return false;
        }
    }, {
        key: 'canTakeExit',
        value: function canTakeExit(vehicle) {
            var destinationExitCell = new _CellJs2['default'](this._exits[vehicle.destinationExit()][0]);
            destinationExitCell.assignToLane(vehicle.frontCell().parentLane());
            return vehicle.currentCells().some(function (cell) {
                return cell.equals(destinationExitCell);
            });
        }
    }]);

    return CellsNeighbours;
})();

exports['default'] = CellsNeighbours;
module.exports = exports['default'];

},{"../JsWhyYouNoImplement.js":5,"./Cell.js":6,"./Specification/Direction.js":13}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _VehicleJs = require('./Vehicle.js');

var _VehicleJs2 = _interopRequireDefault(_VehicleJs);

var _VehicleFactoryJs = require('./VehicleFactory.js');

var _VehicleFactoryJs2 = _interopRequireDefault(_VehicleFactoryJs);

var _CellsMapJs = require('./CellsMap.js');

var CellularAutomata = (function () {
    function CellularAutomata(cellsMap, cellsNeighbours) {
        _classCallCheck(this, CellularAutomata);

        var car1 = _VehicleFactoryJs2['default'].newCar();
        car1.setDestinationExit('N');
        var car2 = _VehicleFactoryJs2['default'].newCar();
        car2.setDestinationExit('N');
        var car3 = _VehicleFactoryJs2['default'].newCar();
        car3.setDestinationExit('N');
        var car4 = _VehicleFactoryJs2['default'].newCar();
        car4.setDestinationExit('N');
        var van = _VehicleFactoryJs2['default'].newVan();
        van.setDestinationExit('N');
        var truck = _VehicleFactoryJs2['default'].newTruck();
        truck.setDestinationExit('N');
        this._vehicles = [car1, car2, car3, car4, truck, van];
        this._cellsMap = cellsMap;
        this._cellsMap.addVehicle(car1, 1, 0);
        this._cellsMap.addVehicle(car2, 1, Math.floor(Math.random() * 69 + 1));
        this._cellsMap.addVehicle(car3, 1, Math.floor(Math.random() * 69 + 1));
        this._cellsMap.addVehicle(car4, 1, Math.floor(Math.random() * 69 + 1));
        this._cellsMap.addVehicle(van, 1, Math.floor(Math.random() * 69 + 1));
        this._cellsMap.addVehicle(truck, 1, Math.floor(Math.random() * 69 + 1));
        this._cellsNeighbours = cellsNeighbours;
    }

    _createClass(CellularAutomata, [{
        key: 'nextIteration',
        value: function nextIteration() {
            var _this = this;

            this._vehicles.forEach(function (vehicle) {
                try {
                    vehicle.moveToNextIteration(_this._cellsMap, _this._cellsNeighbours);
                } catch (e) {
                    if (e instanceof _CellsMapJs.ExitRoadEnd) {
                        vehicle.remove();
                        _this._vehicles.splice(_this._vehicles.indexOf(vehicle), 1);
                    } else {
                        throw e;
                    }
                }
            });
            this._cellsMap.notifyAll();
        }
    }]);

    return CellularAutomata;
})();

exports['default'] = CellularAutomata;
module.exports = exports['default'];

},{"./CellsMap.js":8,"./Vehicle.js":17,"./VehicleFactory.js":18}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observable = (function () {
    function Observable() {
        _classCallCheck(this, Observable);

        this._observers = [];
    }

    _createClass(Observable, [{
        key: "registerObserver",
        value: function registerObserver(observer) {
            this._observers.push(observer);
        }
    }, {
        key: "unregisterObserver",
        value: function unregisterObserver(observer) {
            this._observers.splice(this._observers.indexOf(observer), 1);
        }
    }, {
        key: "notifyAll",
        value: function notifyAll() {
            this._observers.forEach(function (observer) {
                observer.notify();
            });
        }
    }]);

    return Observable;
})();

exports["default"] = Observable;
module.exports = exports["default"];

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _JsWhyYouNoImplementJs = require('../../JsWhyYouNoImplement.js');

var _LaneJs = require('./Lane.js');

var _LaneJs2 = _interopRequireDefault(_LaneJs);

var AdherentRoad = (function () {
    function AdherentRoad(direction, length, entrancesLanes, exitLanes) {
        _classCallCheck(this, AdherentRoad);

        this._length = length;
        this._direction = direction;
        this._entrancesLanes = entrancesLanes;
        this._exitsLanes = exitLanes;
    }

    _createClass(AdherentRoad, [{
        key: 'id',
        value: function id() {
            return this._direction.id();
        }
    }, {
        key: 'length',
        value: function length() {
            return this._length;
        }
    }, {
        key: 'allLanes',
        value: function allLanes() {
            return this._exitsLanes; //this._entrancesLanes.concat(this._exitsLanes); //TODO: Przywrócić jak dodane będzie rysowanie wjazdów
        }
    }], [{
        key: 'newRoad',
        value: function newRoad(direction, length, laneWidth, entrancesLanesCount, exitLanesCount) {
            var entranceLanes = Array.from((0, _JsWhyYouNoImplementJs.range)(0, entrancesLanesCount), function (entranceNumber) {
                return new _LaneJs2['default'](direction.id() + '_ENTRANCE_' + entranceNumber, length, laneWidth, false);
            });
            var exitLanes = Array.from((0, _JsWhyYouNoImplementJs.range)(0, exitLanesCount), function (exitNumber) {
                return new _LaneJs2['default'](direction.id() + '_EXIT_' + exitNumber, length, laneWidth, false);
            });
            exitLanes.reverse();

            return new AdherentRoad(direction, length, entranceLanes, exitLanes);
        }
    }]);

    return AdherentRoad;
})();

exports['default'] = AdherentRoad;
module.exports = exports['default'];

},{"../../JsWhyYouNoImplement.js":5,"./Lane.js":15}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Direction = (function () {
    _createClass(Direction, null, [{
        key: "allDirections",
        value: function allDirections() {
            return Array.from(["N", "S", "E", "W"], function (directionId) {
                return new Direction(directionId);
            });
        }
    }]);

    function Direction(direction) {
        _classCallCheck(this, Direction);

        this._direction = direction;
    }

    _createClass(Direction, [{
        key: "id",
        value: function id() {
            return this._direction;
        }
    }]);

    return Direction;
})();

exports["default"] = Direction;
module.exports = exports["default"];

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InnerRoad = (function () {
    function InnerRoad(lanes) {
        _classCallCheck(this, InnerRoad);

        this._lanes = lanes;
    }

    _createClass(InnerRoad, [{
        key: "allLanes",
        value: function allLanes() {
            return this._lanes;
        }
    }, {
        key: "lanesCount",
        value: function lanesCount() {
            return this._lanes.length;
        }
    }]);

    return InnerRoad;
})();

exports["default"] = InnerRoad;
module.exports = exports["default"];

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Lane = (function () {
    function Lane(id, length, width, isRounded) {
        _classCallCheck(this, Lane);

        this._id = id;
        this._length = length;
        this._width = width;
        this._isRounded = isRounded;
    }

    _createClass(Lane, [{
        key: 'id',
        value: function id() {
            return this._id;
        }
    }, {
        key: 'length',
        value: function length() {
            return this._length;
        }
    }, {
        key: 'isRounded',
        value: function isRounded() {
            return this._isRounded;
        }
    }, {
        key: 'width',
        value: function width() {
            return this._width;
        }
    }, {
        key: 'isExit',
        value: function isExit() {
            return this._id.indexOf('EXIT') != -1;
        }
    }]);

    return Lane;
})();

exports['default'] = Lane;
module.exports = exports['default'];

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _JsWhyYouNoImplementJs = require('../../JsWhyYouNoImplement.js');

var _LaneJs = require('./Lane.js');

var _LaneJs2 = _interopRequireDefault(_LaneJs);

var _DirectionJs = require('./Direction.js');

var _DirectionJs2 = _interopRequireDefault(_DirectionJs);

var _AdherentRoadJs = require('./AdherentRoad.js');

var _AdherentRoadJs2 = _interopRequireDefault(_AdherentRoadJs);

var _InnerRoadJs = require('./InnerRoad.js');

var _InnerRoadJs2 = _interopRequireDefault(_InnerRoadJs);

var RoundaboutSpecification = (function () {
    function RoundaboutSpecification(laneWidth, lanesCount, islandRadius, adherentRoadSpecification) {
        var _this = this;

        _classCallCheck(this, RoundaboutSpecification);

        this._laneWidth = laneWidth;
        this._lanesCount = lanesCount;
        this._islandRadius = islandRadius;
        this._adherentRoadSpecification = adherentRoadSpecification;
        this._adherentRoads = Array.from(_DirectionJs2['default'].allDirections(), function (direction) {
            return _AdherentRoadJs2['default'].newRoad(direction, _this.adherentRoadLength(), laneWidth, adherentRoadSpecification.ingoingLanes, adherentRoadSpecification.outgoingLanes);
        });
        this._innerRoad = new _InnerRoadJs2['default'](Array.from((0, _JsWhyYouNoImplementJs.range)(0, lanesCount), function (laneNumber) {
            return new _LaneJs2['default'](laneNumber, _this.lengthOfLane(laneNumber), laneWidth, true);
        }));
    }

    _createClass(RoundaboutSpecification, [{
        key: 'roundaboutDiameter',
        value: function roundaboutDiameter() {
            var islandDiameter = 2 * this._islandRadius;
            return islandDiameter + this.lanesWidth() * 2;
        }
    }, {
        key: 'roundaboutRadius',
        value: function roundaboutRadius() {
            return this.roundaboutDiameter() / 2;
        }
    }, {
        key: 'lanesCount',
        value: function lanesCount() {
            return this._lanesCount;
        }
    }, {
        key: 'adherentRoadLength',
        value: function adherentRoadLength() {
            return 35; // 25 meters
        }
    }, {
        key: 'lanesWidth',
        value: function lanesWidth() {
            return this._innerRoad.lanesCount() * this.laneWidth();
        }
    }, {
        key: 'lanesNumbers',
        value: function lanesNumbers() {
            return (0, _JsWhyYouNoImplementJs.range)(0, this._innerRoad.lanesCount());
        }
    }, {
        key: 'laneWidth',
        value: function laneWidth() {
            return this._laneWidth;
        }
    }, {
        key: 'islandRadius',
        value: function islandRadius() {
            return this._islandRadius;
        }
    }, {
        key: 'adherentRoadWidth',
        value: function adherentRoadWidth() {
            return this._adherentRoadSpecification.ingoingLanes * this._adherentRoadSpecification.lanesWidth + this._adherentRoadSpecification.outgoingLanes * this._adherentRoadSpecification.lanesWidth;
        }
    }, {
        key: 'adherentLanesCount',
        value: function adherentLanesCount() {
            return this._adherentRoadSpecification.ingoingLanes + this._adherentRoadSpecification.outgoingLanes;
        }
    }, {
        key: 'lengthOfLane',
        value: function lengthOfLane(laneNumber) {
            if (laneNumber >= this.lanesCount()) {
                throw new Error("Incorrect lane number - 0 is the most inner, 1 is outer.");
            }
            return 2 * Math.PI * (this.islandRadius() + laneNumber * this.laneWidth());
        }

        /**
         * Radius is counted to center of the lane
         */
    }, {
        key: 'laneRadius',
        value: function laneRadius(laneNumber) {
            if (laneNumber >= this._innerRoad.lanesCount()) {
                throw new Error("Incorrect lane number - 0 is the most inner, 1 is outer.");
            }

            return this.islandRadius() + this.laneWidth() * laneNumber + this.laneWidth() / 2;
        }
    }, {
        key: 'allLanes',
        value: function allLanes() {
            var allLanes = [];
            this._adherentRoads.forEach(function (adherentRoad) {
                adherentRoad.allLanes().forEach(function (lane) {
                    allLanes.push(lane);
                });
            });
            this._innerRoad.allLanes().forEach(function (lane) {
                allLanes.push(lane);
            });
            return allLanes;
        }
    }, {
        key: 'innerRoadLanes',
        value: function innerRoadLanes() {
            return this._innerRoad.allLanes();
        }
    }, {
        key: 'adherentRoads',
        value: function adherentRoads() {
            return this._adherentRoads;
        }
    }]);

    return RoundaboutSpecification;
})();

var roundaboutBukowe = new RoundaboutSpecification(4.5, 2, 56 / 2, {
    ingoingLanes: 2,
    outgoingLanes: 2,
    lanesWidth: 3.5
});

var roundaboutThreeLanes = new RoundaboutSpecification(4.5, 3, 56 / 2, {
    ingoingLanes: 2,
    outgoingLanes: 2,
    lanesWidth: 3.5
});

exports.roundaboutBukowe = roundaboutBukowe;
exports.roundaboutThreeLanes = roundaboutThreeLanes;

},{"../../JsWhyYouNoImplement.js":5,"./AdherentRoad.js":12,"./Direction.js":13,"./InnerRoad.js":14,"./Lane.js":15}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vehicle = (function () {
    function Vehicle(lengthCells, maxSpeed, maxSpeedWhenTurning) {
        _classCallCheck(this, Vehicle);

        this._lengthCells = lengthCells;
        this._currentSpeed = 1;
        this._maxSpeed = maxSpeed;
        this._id = Math.round(Math.random() * 16777215);
        this._currentCells = [];
        this._maxSpeedWhenTurning = maxSpeedWhenTurning;
    }

    _createClass(Vehicle, [{
        key: "maxSpeedWhenTurning",
        value: function maxSpeedWhenTurning() {
            return this._maxSpeedWhenTurning;
        }
    }, {
        key: "setDestinationExit",
        value: function setDestinationExit(destinationExit) {
            this._destinationExit = destinationExit;
        }
    }, {
        key: "destinationExit",
        value: function destinationExit() {
            return this._destinationExit;
        }
    }, {
        key: "currentSpeed",
        value: function currentSpeed() {
            return this._currentSpeed;
        }
    }, {
        key: "moveToNextIteration",
        value: function moveToNextIteration(cellsMap, cellsNeighbours) {
            if (cellsNeighbours.canTakeExit(this)) {
                cellsMap.takeExit(this);
                return;
            }

            if (cellsNeighbours.isApproachingExit(this)) {
                this._breakBy(1);
                cellsMap.moveVehicleBy(this, this._currentSpeed);
                return;
            }

            if (cellsMap.nothingInFrontOf(this, this._currentSpeed + 1)) {
                if (!this._isMovingWithMaxSpeed()) {
                    this._accelerate();
                }
            } else {
                var breakUpTo = this._distanceFromPrecedingVehicle(cellsMap);
                this._break(breakUpTo);
            }

            cellsMap.moveVehicleBy(this, this._currentSpeed);
        }
    }, {
        key: "remove",
        value: function remove() {
            this._currentCells.forEach(function (cell) {
                cell.setVehicle(null);
            });
            this._currentCells = [];
        }
    }, {
        key: "moveToCells",
        value: function moveToCells(cells) {
            var _this = this;

            if (cells.length != this.lengthCells()) {
                throw new Error("Vehicle received invalid directions!");
            }
            this._currentCells.forEach(function (cell) {
                cell.setVehicle(null);
            });
            cells.forEach(function (cell) {
                cell.setVehicle(_this);
            });
            this._currentCells = cells;
        }
    }, {
        key: "currentCells",
        value: function currentCells() {
            return this._currentCells;
        }
    }, {
        key: "frontCell",
        value: function frontCell() {
            return this.currentCells()[0];
        }
    }, {
        key: "lengthCells",
        value: function lengthCells() {
            return this._lengthCells;
        }
    }, {
        key: "id",
        value: function id() {
            return this._id;
        }
    }, {
        key: "_isMovingWithMaxSpeed",
        value: function _isMovingWithMaxSpeed() {
            return this._currentSpeed == this._maxSpeed;
        }
    }, {
        key: "_accelerate",
        value: function _accelerate() {
            if (this._currentSpeed < this._maxSpeed) {
                this._currentSpeed++;
            }
        }
    }, {
        key: "_break",
        value: function _break(to) {
            this._currentSpeed = to;
        }
    }, {
        key: "_breakBy",
        value: function _breakBy(by) {
            if (this._currentSpeed - by > 0) {
                this._currentSpeed -= by;
            }
        }
    }, {
        key: "_distanceFromPrecedingVehicle",
        value: function _distanceFromPrecedingVehicle(cellsMap) {
            var distanceNotEmpty = this._currentSpeed;
            while (!cellsMap.nothingInFrontOf(this, distanceNotEmpty)) {
                distanceNotEmpty--;
            }
            return distanceNotEmpty;
        }
    }]);

    return Vehicle;
})();

exports["default"] = Vehicle;
module.exports = exports["default"];

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _VehicleJs = require('./Vehicle.js');

var _VehicleJs2 = _interopRequireDefault(_VehicleJs);

var VehicleFactory = (function () {
    function VehicleFactory() {
        _classCallCheck(this, VehicleFactory);
    }

    _createClass(VehicleFactory, null, [{
        key: 'newCar',
        value: function newCar() {
            return new _VehicleJs2['default'](2, 5, 2);
        }
    }, {
        key: 'newMotorcycle',
        value: function newMotorcycle() {
            return new _VehicleJs2['default'](1, 5, 2);
        }
    }, {
        key: 'newVan',
        value: function newVan() {
            return new _VehicleJs2['default'](3, 5, 2);
        }
    }, {
        key: 'newMiniBus',
        value: function newMiniBus() {
            return new _VehicleJs2['default'](4, 3, 2);
        }
    }, {
        key: 'newBus',
        value: function newBus() {
            return new _VehicleJs2['default'](5, 2, 1);
        }
    }, {
        key: 'newTruck',
        value: function newTruck() {
            return new _VehicleJs2['default'](5, 2, 1);
        }
    }]);

    return VehicleFactory;
})();

exports['default'] = VehicleFactory;
module.exports = exports['default'];

},{"./Vehicle.js":17}],19:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _GUIRoundaboutDrawerJs = require('./GUI/RoundaboutDrawer.js');

var _GUICellsDrawerJs = require('./GUI/CellsDrawer.js');

var _GUICellsDrawerJs2 = _interopRequireDefault(_GUICellsDrawerJs);

var _GUITranslatorJs = require('./GUI/Translator.js');

var _GUITranslatorJs2 = _interopRequireDefault(_GUITranslatorJs);

var _GUIUnitConverterJs = require('./GUI/UnitConverter.js');

var _GUIUnitConverterJs2 = _interopRequireDefault(_GUIUnitConverterJs);

var _SimulationSpecificationRoundaboutSpecificationsJs = require('./Simulation/Specification/RoundaboutSpecifications.js');

var _SimulationCellsMapJs = require('./Simulation/CellsMap.js');

var _SimulationCellularAutomataJs = require('./Simulation/CellularAutomata.js');

var _SimulationCellularAutomataJs2 = _interopRequireDefault(_SimulationCellularAutomataJs);

var _SimulationCellsNeighboursJs = require('./Simulation/CellsNeighbours.js');

var _SimulationCellsNeighboursJs2 = _interopRequireDefault(_SimulationCellsNeighboursJs);

var unitConverter = new _GUIUnitConverterJs2['default'](_SimulationSpecificationRoundaboutSpecificationsJs.roundaboutThreeLanes.roundaboutDiameter() + _SimulationSpecificationRoundaboutSpecificationsJs.roundaboutThreeLanes.adherentRoadLength() * 2, Math.min(window.innerWidth, window.innerHeight));

var canvasElement = document.getElementById("canvas");
var twojs = new Two({
    width: canvasElement.clientWidth,
    height: window.innerHeight,
    autostart: true
}).appendTo(canvasElement);

var roundaboutBukoweCellsMap = new _SimulationCellsMapJs.CellsMap(_SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe, unitConverter);

var roundaboutThreeLanesCellsMap = new _SimulationCellsMapJs.CellsMap(_SimulationSpecificationRoundaboutSpecificationsJs.roundaboutThreeLanes, unitConverter);

var translator = new _GUITranslatorJs2['default'](_SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe, unitConverter, twojs);

var roundaboutDrawer = new _GUIRoundaboutDrawerJs.RoundaboutDrawer(_SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe, unitConverter, twojs, translator);

var roundaboutCellsDrawer = new _GUICellsDrawerJs2['default'](_SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe, roundaboutBukoweCellsMap, unitConverter, twojs, translator);

var cellsNeighbours = new _SimulationCellsNeighboursJs2['default'](roundaboutBukoweCellsMap.cellsCountOnLane(roundaboutBukoweCellsMap.outerLaneNumber()));
var cellularAutomata = new _SimulationCellularAutomataJs2['default'](roundaboutBukoweCellsMap, cellsNeighbours);

roundaboutDrawer.draw();
setInterval(function () {
    cellularAutomata.nextIteration();
}, 1000);

},{"./GUI/CellsDrawer.js":1,"./GUI/RoundaboutDrawer.js":2,"./GUI/Translator.js":3,"./GUI/UnitConverter.js":4,"./Simulation/CellsMap.js":8,"./Simulation/CellsNeighbours.js":9,"./Simulation/CellularAutomata.js":10,"./Simulation/Specification/RoundaboutSpecifications.js":16}]},{},[19]);
