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
            this._drawnCells = [];
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
                cellElement.stroke = "#FFFFFF";
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
        key: 'cellsNextToNumber',
        value: function cellsNextToNumber(cellNumber, limitTo) {
            var cell = this._allCells[cellNumber];
            return this.cellsNextTo(cell, limitTo);
        }
    }, {
        key: 'cellsPreviousToNumber',
        value: function cellsPreviousToNumber(cellNumber, limitTo) {
            var cell = this._allCells[cellNumber];
            return this.cellsPreviousTo(cell, limitTo);
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
        key: 'cellsCount',
        value: function cellsCount() {
            return this._allCells.length;
        }
    }, {
        key: 'firstCells',
        value: function firstCells(numberOfCells) {
            return this._allCells.slice(0, numberOfCells);
        }
    }, {
        key: 'isExitLane',
        value: function isExitLane() {
            return this.id().toString().includes('EXIT');
        }
    }, {
        key: 'isEntranceLane',
        value: function isEntranceLane() {
            return this.id().toString().includes('ENTRANCE');
        }
    }, {
        key: 'isRoundaboutLane',
        value: function isRoundaboutLane() {
            return !this.isExitLane() && !this.isEntranceLane();
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
        this._lanes = new Map();
        this._divideLanesToCells();
    }

    _createClass(CellsMap, [{
        key: '_divideLanesToCells',
        value: function _divideLanesToCells() {
            var _this = this;

            this._roundaboutSpecification.allLanes().forEach(function (lane) {
                _this._lanes.set(lane.id(), _CellsLaneJs2['default'].newLane(lane.id(), _this._unitConverter.metersAsCells(lane.length()), lane.isRounded()));
            });
        }
    }, {
        key: '_innerRoadLanes',
        value: function _innerRoadLanes() {
            return Array.from(this._lanes.values(), function (lane) {
                if (lane.isRoundaboutLane()) {
                    return lane;
                }
            }).filter(function (element) {
                return element !== undefined;
            });
        }
    }, {
        key: 'cellsOnLane',
        value: function cellsOnLane(laneNumber) {
            return this._lanes.get(laneNumber).allCells();
        }
    }, {
        key: 'cellsCountsOnInnerRoadLanes',
        value: function cellsCountsOnInnerRoadLanes() {
            return Array.from(this._innerRoadLanes(), function (lane) {
                return lane.allCells().length;
            });
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
            var newVehicleCells = nextCells.reverse();
            var oldVehicleCells = vehicle.currentCells();
            newVehicleCells = newVehicleCells.concat(oldVehicleCells);
            vehicle.moveToCells(newVehicleCells.slice(0, vehicle.lengthCells()));
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
        key: 'nothingOnRoundaboutFrom',
        value: function nothingOnRoundaboutFrom(roundaboutLaneId, cellNumber, numberOfCellsToCheck) {
            var roundaboutLane = this._lanes.get(roundaboutLaneId);
            var nextCells = roundaboutLane.cellsNextToNumber(cellNumber, numberOfCellsToCheck);
            return nextCells.every(function (cell) {
                return cell.isEmpty();
            });
        }
    }, {
        key: 'nothingOnEntrance',
        value: function nothingOnEntrance(entranceLaneId, numberOfCellsToCheck) {
            var entranceLane = this._lanes.get(entranceLaneId);
            var nextCells = entranceLane.cellsNextToNumber(0, numberOfCellsToCheck);
            return nextCells.every(function (cell) {
                return cell.isEmpty();
            });
        }
    }, {
        key: 'exitLaneEmpty',
        value: function exitLaneEmpty(vehicle, numberOfCellsToCheck) {
            var exitLaneId = vehicle.destinationExit() + "_EXIT_" + vehicle.destinationExitLaneId().toString();
            var exitLane = this._lanes.get(exitLaneId);
            var exitLaneFirstCells = exitLane.firstCells(numberOfCellsToCheck + 1);
            return exitLaneFirstCells.every(function (cell) {
                return cell.isEmpty() || cell.vehicle() == vehicle;
            });
        }
    }, {
        key: 'vehicleOnTheRight',
        value: function vehicleOnTheRight(vehicle) {
            var laneIdOnTheRight = null;
            var cellOnTheRightId = null;
            if (vehicle.frontCell().parentLane().isRoundaboutLane()) {
                laneIdOnTheRight = this._roundaboutSpecification.laneIdToTheRightOf(vehicle.currentLaneId());
                cellOnTheRightId = this.cellOnRoundaboutOnTheRightOf(vehicle.frontCell().number());
            } else if (vehicle.frontCell().parentLane().isEntranceLane()) {
                laneIdOnTheRight = this._roundaboutSpecification.entranceLaneIdToTheRightOf(vehicle.currentLaneId());
                cellOnTheRightId = vehicle.frontCell().number();
            }
            if (laneIdOnTheRight == null) {
                return null;
            }
            var laneOnTheRight = this._lanes.get(laneIdOnTheRight);
            var cellOnTheRight = laneOnTheRight.allCells()[cellOnTheRightId];
            var cellsOnTheRight = laneOnTheRight.cellsPreviousToInclusive(cellOnTheRight, 4);
            var cellWithAVehicle = cellsOnTheRight.find(function (cell) {
                if (cell.vehicle()) {
                    return true;
                }
                return false;
            });
            if (cellWithAVehicle) {
                return cellWithAVehicle.vehicle();
            }

            return null;
        }
    }, {
        key: 'vehicleOnTheLeftOnRoundabout',
        value: function vehicleOnTheLeftOnRoundabout(vehicle) {
            var laneIdOnTheLeft = this._roundaboutSpecification.laneIdToTheLeftOf(vehicle.currentLaneId());
            if (laneIdOnTheLeft == null) {
                return null;
            }
            var laneOnTheLeft = this._lanes.get(laneIdOnTheLeft);
            var cellOnTheLeftId = this.cellOnRoundaboutOnTheLeftOf(vehicle.frontCell().number());
            var cellOnTheLeft = laneOnTheLeft.allCells()[cellOnTheLeftId];
            var cellsOnTheLeft = laneOnTheLeft.cellsPreviousToInclusive(cellOnTheLeft, 6);
            // cellsOnTheLeft = cellsOnTheLeft.concat(laneOnTheLeft.cellsNextTo(cellOnTheLeft, 4)); //TODO: Sprawdzic takze w przód :/
            var cellWithAVehicle = cellsOnTheLeft.find(function (cell) {
                if (cell.vehicle()) {
                    return true;
                }
                return false;
            });
            if (cellWithAVehicle) {
                return cellWithAVehicle.vehicle();
            }

            return null;
        }
    }, {
        key: 'vehiclesOnTheLeft',
        value: function vehiclesOnTheLeft(vehicle, cellsNeighbours) {
            var _this2 = this;

            var roundaboutLanes = this._roundaboutSpecification.lanesNumbers(); // [0,1]
            var vehiclesOnTheLeft = new Map();
            roundaboutLanes.forEach(function (laneId) {
                var lane = _this2._lanes.get(laneId); // CellsLane
                var cellAheadId = cellsNeighbours.firstCellNumberOnEntrance(vehicle.entranceRoadId(), vehicle.entranceLaneId(), laneId);
                var cellsOnTheLeft = lane.cellsPreviousToNumber(cellAheadId, 5);
                var cellWithAVehicle = cellsOnTheLeft.find(function (cell) {
                    if (cell.vehicle()) {
                        return true;
                    }
                    return false;
                });
                if (cellWithAVehicle) {
                    vehiclesOnTheLeft.set(laneId, cellWithAVehicle.vehicle());
                }
            });
            return vehiclesOnTheLeft;
        }
    }, {
        key: 'takeExit',
        value: function takeExit(vehicle) {
            var oldVehicleCells = vehicle.currentCells();
            var sliceFrom = Math.max(0, vehicle.currentSpeed() - vehicle.lengthCells());
            var sliceTo = vehicle.currentSpeed();
            var newVehicleCells = this._lanes.get(vehicle.destinationExit() + "_EXIT_" + vehicle.destinationExitLaneId().toString()).allCells().slice(sliceFrom, sliceTo).reverse();
            var newVehicleCells = newVehicleCells.concat(oldVehicleCells.slice(0, Math.max(0, oldVehicleCells.length - newVehicleCells.length)));
            vehicle.moveToCells(newVehicleCells);
        }
    }, {
        key: 'takeEntrance',
        value: function takeEntrance(vehicle, cellsNeighbours) {
            var roundaboutLaneId = vehicle.roundaboutLaneId();
            var firstCellOnRoundaboutNumber = cellsNeighbours.firstCellNumberOnEntrance(vehicle.entranceRoadId(), vehicle.entranceLaneId(), roundaboutLaneId);
            var roundaboutLane = this._lanes.get(roundaboutLaneId);
            var sliceFrom = Math.max(0, vehicle.currentSpeed() - vehicle.lengthCells());
            var sliceTo = vehicle.currentSpeed();
            var newVehicleCells = roundaboutLane.cellsNextToNumber(firstCellOnRoundaboutNumber, vehicle.currentSpeed());
            newVehicleCells = newVehicleCells.slice(sliceFrom, sliceTo).reverse();
            var oldVehicleCells = vehicle.currentCells();
            newVehicleCells = newVehicleCells.concat(oldVehicleCells.slice(0, oldVehicleCells.length - newVehicleCells.length));
            vehicle.moveToCells(newVehicleCells);
        }
    }, {
        key: 'cellOnRoundaboutOnTheRightOf',
        value: function cellOnRoundaboutOnTheRightOf(leftCellId) {
            var multiplier = this._lanes.get(1).cellsCount() / this._lanes.get(0).cellsCount();
            return Math.round(leftCellId * multiplier);
        }
    }, {
        key: 'cellOnRoundaboutOnTheLeftOf',
        value: function cellOnRoundaboutOnTheLeftOf(rightCellId) {
            var multiplier = this._lanes.get(0).cellsCount() / this._lanes.get(1).cellsCount();
            return Math.round(rightCellId * multiplier);
        }
    }]);

    return CellsMap;
})(_ObservableJs2['default']);

exports.CellsMap = CellsMap;
exports.ExitRoadEnd = ExitRoadEnd;

},{"./Cell.js":6,"./CellsLane.js":7,"./Observable.js":14,"./Vehicle.js":22}],9:[function(require,module,exports){
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
    function CellsNeighbours(roundaboutLaneCellsCount, entranceLanesCount, entranceLaneCellsCount) {
        var _this = this;

        _classCallCheck(this, CellsNeighbours);

        this._maxCellIdOnEntrance = entranceLaneCellsCount - 1;
        this._exits = Array.from(roundaboutLaneCellsCount, function (laneCellsCount) {
            var roadEvery = laneCellsCount / 4;
            var firstRoadAt = roadEvery;
            var exits = new Map();
            exits.set('N', [Math.round(firstRoadAt + roadEvery * 0) - 3, Math.round(firstRoadAt + roadEvery * 0) - 2]);
            exits.set('W', [Math.round(firstRoadAt + roadEvery * 1) - 3, Math.round(firstRoadAt + roadEvery * 1) - 2]);
            exits.set('S', [Math.round(firstRoadAt + roadEvery * 2) - 3, Math.round(firstRoadAt + roadEvery * 2) - 2]);
            exits.set('E', [Math.round(firstRoadAt + roadEvery * 3) - 3, Math.round(firstRoadAt + roadEvery * 3) - 2]);
            return exits;
        });
        this._entrances = new Map();
        ["N", "W", "S", "E"].forEach(function (direction, multiplier) {
            roundaboutLaneCellsCount.forEach(function (laneCellsCount, roundaboutLaneId) {
                var roadEvery = laneCellsCount / 4;
                (0, _JsWhyYouNoImplementJs.range)(0, entranceLanesCount).forEach(function (entranceLaneId) {
                    var value = Math.round(roadEvery * (multiplier + 1) + 2 - entranceLaneId);
                    if (value >= laneCellsCount) {
                        value = value - laneCellsCount;
                    }
                    _this._entrances.set(direction + ' ' + entranceLaneId + ' ' + roundaboutLaneId, value);
                });
            });
        });
    }

    _createClass(CellsNeighbours, [{
        key: 'isApproachingDestinationExit',
        value: function isApproachingDestinationExit(vehicle) {
            var closestDestinationExitOn = this._destinationExitCellIdFor(vehicle);
            if (closestDestinationExitOn == null) {
                return false;
            }
            return this._isApproachingExit(closestDestinationExitOn, vehicle);
        }
    }, {
        key: 'isApproachingAnyExit',
        value: function isApproachingAnyExit(vehicle) {
            var _this2 = this;

            var approaches = Array.from(this._exits[vehicle.currentLaneId()].values(), function (exitsCells) {
                var exitApproaches = Array.from(exitsCells, function (exitCell) {
                    return _this2._isApproachingExit(exitCell, vehicle);
                });
                return exitApproaches.some(function (approach) {
                    return approach;
                });
            });
            return approaches.some(function (approach) {
                return approach;
            });
        }
    }, {
        key: 'closestExitId',
        value: function closestExitId(vehicle) {
            var exits = Array.from(this._exits[vehicle.currentLaneId()].entries(), function (exit) {
                var exitCellId = exit[1][0];
                var exitName = exit[0];
                var distanceFromExit = exitCellId - vehicle.frontCell().number();
                return [exitName, distanceFromExit];
            });
            exits = exits.filter(function (element) {
                return element[1] >= 0;
            });
            exits.sort(function (a, b) {
                if (a[1] > b[1]) {
                    return 1;
                } else {
                    return -1;
                }
            });
            if (exits.length == 0) {
                return _SpecificationDirectionJs2['default'].newNorth().id();
            }
            return exits[0][0];
        }
    }, {
        key: 'isApproachingRoundabout',
        value: function isApproachingRoundabout(vehicle) {
            var distanceFromEntrance = this._maxCellIdOnEntrance - vehicle.frontCell().number();
            return this._isApproaching(distanceFromEntrance, vehicle);
        }
    }, {
        key: 'approachedDestinationExit',
        value: function approachedDestinationExit(vehicle) {
            var destinationExitCellId = this._destinationExitCellIdFor(vehicle);
            if (destinationExitCellId == null) {
                return false;
            }
            var destinationExitCell = new _CellJs2['default'](destinationExitCellId);
            destinationExitCell.assignToLane(vehicle.frontCell().parentLane());
            return vehicle.currentCells().some(function (cell) {
                return cell.equals(destinationExitCell);
            });
        }
    }, {
        key: 'approachedAnyExit',
        value: function approachedAnyExit(vehicle) {
            var approaches = Array.from(this._exits[vehicle.currentLaneId()].values(), function (exitsCells) {
                var exitApproaches = Array.from(exitsCells, function (exitCell) {
                    if (Math.abs(exitCell - vehicle.frontCell().number()) <= 1) {
                        return true;
                    }
                    return false;
                });
                return exitApproaches.some(function (approach) {
                    return approach;
                });
            });
            return approaches.some(function (approach) {
                return approach;
            });
        }
    }, {
        key: 'approachedEntrance',
        value: function approachedEntrance(vehicle) {
            return vehicle.frontCell().parentLane().isEntranceLane() && vehicle.frontCell().number() == this._maxCellIdOnEntrance;
        }
    }, {
        key: 'firstCellNumberOnEntrance',
        value: function firstCellNumberOnEntrance(entranceRoadId, entranceLaneId, roundaboutLaneId) {
            return this._entrances.get(entranceRoadId + ' ' + entranceLaneId + ' ' + roundaboutLaneId);
        }
    }, {
        key: '_destinationExitCellIdFor',
        value: function _destinationExitCellIdFor(vehicle) {
            var destinationExits = this._exits[vehicle.currentLaneId()];
            if (!destinationExits) {
                return null;
            }
            var destinationExit = destinationExits.get(vehicle.destinationExit());
            return destinationExit[vehicle.destinationExitLaneId()];
        }
    }, {
        key: '_isApproachingExit',
        value: function _isApproachingExit(exitCell, vehicle) {
            var distanceFromExit = exitCell - vehicle.frontCell().number();
            return this._isApproaching(distanceFromExit, vehicle);
        }
    }, {
        key: '_isApproaching',
        value: function _isApproaching(distanceFrom, vehicle) {
            var distanceTravelledIfStartsSlowingDown = (0, _JsWhyYouNoImplementJs.range)(vehicle.maxSpeedWhenTurning(), Math.max(0, vehicle.currentSpeed() - 1)).reduce(function (previousValue, currentValue) {
                return previousValue + currentValue;
            }, 0);
            if (distanceTravelledIfStartsSlowingDown >= distanceFrom && distanceFrom > 0) {
                return true;
            }
            return false;
        }
    }]);

    return CellsNeighbours;
})();

exports['default'] = CellsNeighbours;
module.exports = exports['default'];

},{"../JsWhyYouNoImplement.js":5,"./Cell.js":6,"./Specification/Direction.js":18}],10:[function(require,module,exports){
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

var _SpecificationDirectionJs = require('./Specification/Direction.js');

var _SpecificationDirectionJs2 = _interopRequireDefault(_SpecificationDirectionJs);

var _JsWhyYouNoImplementJs = require('../JsWhyYouNoImplement.js');

var _PathJs = require('./Path.js');

var _PathJs2 = _interopRequireDefault(_PathJs);

var VehicleQueue = (function () {
    function VehicleQueue() {
        _classCallCheck(this, VehicleQueue);

        this._vehicles = [];
    }

    _createClass(VehicleQueue, [{
        key: 'addVehicle',
        value: function addVehicle(vehicle) {
            this._vehicles.push(vehicle);
        }
    }, {
        key: 'nextVehicle',
        value: function nextVehicle() {
            return this._vehicles.pop();
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            return this._vehicles.length == 0;
        }
    }]);

    return VehicleQueue;
})();

var CellularAutomata = (function () {
    function CellularAutomata(cellsMap, cellsNeighbours, drivingRules, ingoingLanesCount) {
        var _this = this;

        var truckRatio = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
        var vehicleCount = arguments.length <= 5 || arguments[5] === undefined ? 500 : arguments[5];

        _classCallCheck(this, CellularAutomata);

        this._iterations = 0;
        this._cellsMap = cellsMap;
        this._cellsNeighbours = cellsNeighbours;
        this._drivingRules = drivingRules;
        this._vehicles = [];

        var vehicles = [];
        (0, _JsWhyYouNoImplementJs.range)(0, Math.round(vehicleCount * (1 - truckRatio))).forEach(function () {
            vehicles.push(_VehicleFactoryJs2['default'].newCar(_this._drivingRules));
        });
        (0, _JsWhyYouNoImplementJs.range)(0, Math.round(vehicleCount * truckRatio)).forEach(function () {
            vehicles.push(_VehicleFactoryJs2['default'].newTruck(_this._drivingRules));
        });
        vehicles.forEach(function (vehicle) {
            vehicle.setPath(drivingRules.randomPath());
        });
        vehicles = vehicles.sort(function () {
            return 0.5 < Math.random();
        });

        this._vehiclesQueues = new Map();
        _SpecificationDirectionJs2['default'].allDirections().forEach(function (entranceRoadDirection) {
            (0, _JsWhyYouNoImplementJs.range)(0, ingoingLanesCount).forEach(function (entranceLaneId) {
                _this._vehiclesQueues.set(entranceRoadDirection.id() + '_ENTRANCE_' + entranceLaneId, new VehicleQueue());
            });
        });

        vehicles.forEach(function (vehicle) {
            var queue = _this._vehiclesQueues.get(vehicle.entranceRoadId() + '_ENTRANCE_' + vehicle.entranceLaneId());
            queue.addVehicle(vehicle);
        });
        this._addVehiclesFromQueue();
    }

    _createClass(CellularAutomata, [{
        key: 'nextIteration',
        value: function nextIteration() {
            this._iterations++;
            this._moveVehicles();
            this._addVehiclesFromQueue();
            this._cellsMap.notifyAll();
        }
    }, {
        key: 'hasFinished',
        value: function hasFinished() {
            var allQueuesEmpty = Array.from(this._vehiclesQueues.values()).every(function (queue) {
                return queue.isEmpty();
            });
            var allVehiclesLeft = this._vehicles.length == 0;
            return allVehiclesLeft && allQueuesEmpty;
        }
    }, {
        key: 'iterations',
        value: function iterations() {
            return this._iterations;
        }
    }, {
        key: '_moveVehicles',
        value: function _moveVehicles() {
            for (var i = 0; i < this._vehicles.length; i++) {
                var vehicle = this._vehicles[i];
                try {
                    vehicle.moveToNextIteration(this._cellsMap, this._cellsNeighbours);
                } catch (e) {
                    if (e instanceof _CellsMapJs.ExitRoadEnd) {
                        vehicle.remove();
                        this._vehicles.splice(i, 1);
                    } else {
                        throw e;
                    }
                }
            }
        }
    }, {
        key: '_addVehiclesFromQueue',
        value: function _addVehiclesFromQueue() {
            var _this2 = this;

            this._vehiclesQueues.forEach(function (queue, queueLane) {
                var vehicle = queue.nextVehicle();
                if (vehicle) {
                    if (_this2._cellsMap.nothingOnEntrance(queueLane, vehicle.lengthCells())) {
                        _this2._vehicles.push(vehicle);
                        _this2._cellsMap.addVehicle(vehicle, queueLane, vehicle.lengthCells() - 1);
                    } else {
                        queue.addVehicle(vehicle);
                    }
                }
            });
        }
    }]);

    return CellularAutomata;
})();

exports['default'] = CellularAutomata;
module.exports = exports['default'];

},{"../JsWhyYouNoImplement.js":5,"./CellsMap.js":8,"./Path.js":15,"./Specification/Direction.js":18,"./Vehicle.js":22,"./VehicleFactory.js":23}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _SpecificationDirectionJs = require('./Specification/Direction.js');

var _SpecificationDirectionJs2 = _interopRequireDefault(_SpecificationDirectionJs);

var _RandomNumberGeneratorJs = require('./RandomNumberGenerator.js');

var _RandomNumberGeneratorJs2 = _interopRequireDefault(_RandomNumberGeneratorJs);

var _PathJs = require('./Path.js');

var _PathJs2 = _interopRequireDefault(_PathJs);

var _EntranceRulesJs = require('./EntranceRules.js');

var _ExitRulesJs = require('./ExitRules.js');

var CurrentRoundaboutRules = (function () {
    function CurrentRoundaboutRules() {
        _classCallCheck(this, CurrentRoundaboutRules);
    }

    _createClass(CurrentRoundaboutRules, [{
        key: 'isOnRightOfWay',
        value: function isOnRightOfWay() {
            return true;
        }
    }, {
        key: 'shouldYieldToVehicleOnTheLeft',
        value: function shouldYieldToVehicleOnTheLeft() {
            return false;
        }
    }]);

    return CurrentRoundaboutRules;
})();

var SuggestedRoundaboutRules = (function () {
    function SuggestedRoundaboutRules() {
        _classCallCheck(this, SuggestedRoundaboutRules);
    }

    _createClass(SuggestedRoundaboutRules, [{
        key: 'isOnRightOfWay',
        value: function isOnRightOfWay(vehicle, cellsMap) {
            return false;
        }
    }, {
        key: 'shouldYieldToVehicleOnTheLeft',
        value: function shouldYieldToVehicleOnTheLeft(cellsMap, cellsNeighbours, vehicle) {
            var vehicleOnTheLeft = cellsMap.vehicleOnTheLeftOnRoundabout(vehicle);
            if (!vehicleOnTheLeft) {
                return false;
            }
            if (vehicleOnTheLeft.destinationExit() == cellsNeighbours.closestExitId(vehicle) && vehicle.destinationExit() != cellsNeighbours.closestExitId(vehicle)) {
                return true;
            }
            return false;
        }
    }]);

    return SuggestedRoundaboutRules;
})();

var DrivingRules = (function () {
    function DrivingRules(adherentRoadLanesCount, entranceRules, exitRules, roundaboutRules) {
        _classCallCheck(this, DrivingRules);

        this._entrancesExitsLanesCount = adherentRoadLanesCount / 2;
        this.entranceRules = entranceRules;
        this.exitRules = exitRules;
        this.roundaboutRules = roundaboutRules;
    }

    _createClass(DrivingRules, [{
        key: 'randomPath',
        value: function randomPath() {
            var randomNumberGenerator = new _RandomNumberGeneratorJs2['default']();
            var entranceRoad = this._randomElementFrom(_SpecificationDirectionJs2['default'].allDirections());
            var exitRoad = this._randomElementFrom(_SpecificationDirectionJs2['default'].allDirections());
            var entranceLaneId = randomNumberGenerator.intFromTo(0, this._entrancesExitsLanesCount - 1);
            var roundaboutLaneId = this._randomElementFrom(this.entranceRules.possibleRoundaboutLanesFrom(entranceLaneId));
            var destinationExitLaneId = this._randomElementFrom(this.exitRules.possibleExitLanesFrom(roundaboutLaneId));

            return new _PathJs2['default'](entranceRoad, entranceLaneId, roundaboutLaneId, exitRoad, destinationExitLaneId);
        }
    }, {
        key: '_randomElementFrom',
        value: function _randomElementFrom(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
    }], [{
        key: 'newRules1',
        value: function newRules1(roundaboutLanesCount, adherentRoadLanesCount) {
            return new DrivingRules(adherentRoadLanesCount, new _EntranceRulesJs.CurrentRules(roundaboutLanesCount), new _ExitRulesJs.CurrentRules(roundaboutLanesCount), new CurrentRoundaboutRules());
        }
    }, {
        key: 'newRules2',
        value: function newRules2(roundaboutLanesCount, adherentRoadLanesCount) {
            return new DrivingRules(adherentRoadLanesCount, new _EntranceRulesJs.SuggestedRules(roundaboutLanesCount), new _ExitRulesJs.CurrentRules(roundaboutLanesCount), new CurrentRoundaboutRules());
        }
    }, {
        key: 'newRules3',
        value: function newRules3(roundaboutLanesCount, adherentRoadLanesCount) {
            return new DrivingRules(adherentRoadLanesCount, new _EntranceRulesJs.CurrentRules(roundaboutLanesCount), new _ExitRulesJs.SuggestedRules(roundaboutLanesCount), new CurrentRoundaboutRules());
        }
    }, {
        key: 'newRules4',
        value: function newRules4(roundaboutLanesCount, adherentRoadLanesCount) {
            return new DrivingRules(adherentRoadLanesCount, new _EntranceRulesJs.SuggestedRules(roundaboutLanesCount), new _ExitRulesJs.SuggestedRules(roundaboutLanesCount), new CurrentRoundaboutRules());
        }
    }, {
        key: 'newRules5',
        value: function newRules5(roundaboutLanesCount, adherentRoadLanesCount) {
            return new DrivingRules(adherentRoadLanesCount, new _EntranceRulesJs.SuggestedRules(roundaboutLanesCount), new _ExitRulesJs.SuggestedRulesWithChangedRightOfWay(roundaboutLanesCount), new SuggestedRoundaboutRules());
        }
    }]);

    return DrivingRules;
})();

exports.DrivingRules = DrivingRules;

},{"./EntranceRules.js":12,"./ExitRules.js":13,"./Path.js":15,"./RandomNumberGenerator.js":16,"./Specification/Direction.js":18}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _JsWhyYouNoImplementJs = require('../JsWhyYouNoImplement.js');

var EntranceRule = (function () {
    function EntranceRule(numberOfRoundaboutLanes) {
        _classCallCheck(this, EntranceRule);

        this._numberOfRoundaboutLanes = numberOfRoundaboutLanes;
    }

    _createClass(EntranceRule, [{
        key: "shouldYieldTo",
        value: function shouldYieldTo(vehicle, another_vehicle) {
            if (this._isTakingExitRightBeforeEntrance(vehicle, another_vehicle)) {
                return false;
            }
            if (vehicle.isEnteringRoundabout() && another_vehicle.isOnRoundabout()) {
                return this._isCrossingRoundaboutLaneOf(vehicle, another_vehicle);
            }
            if (this._bothAreEntering(vehicle, another_vehicle)) {
                return this._isOnTheLeftOf(vehicle, another_vehicle) && vehicle.roundaboutLaneId() >= another_vehicle.roundaboutLaneId();
            }
            throw new Error("Entrance Rule 1 unknown situation");
        }
    }, {
        key: "_isTakingExitRightBeforeEntrance",
        value: function _isTakingExitRightBeforeEntrance(vehicle, another_vehicle) {
            return vehicle.entranceRoadId() == another_vehicle.destinationExit();
        }
    }, {
        key: "_bothAreEntering",
        value: function _bothAreEntering(vehicle, another_vehicle) {
            return vehicle.isEnteringRoundabout() && another_vehicle.isEnteringRoundabout();
        }
    }, {
        key: "_isCrossingRoundaboutLaneOf",
        value: function _isCrossingRoundaboutLaneOf(vehicle, another_vehicle) {
            return vehicle.roundaboutLaneId() <= another_vehicle.roundaboutLaneId();
        }
    }, {
        key: "_isOnTheLeftOf",
        value: function _isOnTheLeftOf(vehicle, another_vehicle) {
            return vehicle.entranceLaneId() > another_vehicle.entranceLaneId();
        }
    }]);

    return EntranceRule;
})();

var CurrentRules = (function (_EntranceRule) {
    _inherits(CurrentRules, _EntranceRule);

    function CurrentRules() {
        _classCallCheck(this, CurrentRules);

        _get(Object.getPrototypeOf(CurrentRules.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(CurrentRules, [{
        key: "possibleRoundaboutLanesFrom",
        value: function possibleRoundaboutLanesFrom(laneId) {
            return (0, _JsWhyYouNoImplementJs.range)(0, this._numberOfRoundaboutLanes);
        }
    }]);

    return CurrentRules;
})(EntranceRule);

var SuggestedRules = (function (_EntranceRule2) {
    _inherits(SuggestedRules, _EntranceRule2);

    function SuggestedRules() {
        _classCallCheck(this, SuggestedRules);

        _get(Object.getPrototypeOf(SuggestedRules.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(SuggestedRules, [{
        key: "possibleRoundaboutLanesFrom",
        value: function possibleRoundaboutLanesFrom(laneId) {
            if (this._numberOfRoundaboutLanes == 2) {
                return [1 - laneId];
            }
            if (this._numberOfRoundaboutLanes == 3) {
                return [1 - laneId, 1 - laneId + 1];
            }
        }
    }]);

    return SuggestedRules;
})(EntranceRule);

exports.CurrentRules = CurrentRules;
exports.SuggestedRules = SuggestedRules;

},{"../JsWhyYouNoImplement.js":5}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExitRules = (function () {
    function ExitRules(numberOfRoundaboutLanes) {
        _classCallCheck(this, ExitRules);

        this._numberOfRoundaboutLanes = numberOfRoundaboutLanes;
    }

    _createClass(ExitRules, [{
        key: "shouldYieldTo",
        value: function shouldYieldTo(vehicle, another_vehicle) {
            if (this._isOnOuterLane(vehicle)) {
                return false;
            }

            if (!this._vehiclesLeaveAtTheSameExit(vehicle, another_vehicle)) {
                return this._isOnMiddleLane(vehicle);
            }

            if (this._vehiclesLeaveAtTheSameExit(vehicle, another_vehicle)) {
                if (this._vehiclesTakeTheSameLane(vehicle, another_vehicle)) {
                    return !this._isOnOuterLane(vehicle);
                } else {
                    return false;
                }
            }
        }
    }, {
        key: "_vehiclesLeaveAtTheSameExit",
        value: function _vehiclesLeaveAtTheSameExit(vehicle, another_vehicle) {
            return vehicle.destinationExit() == another_vehicle.destinationExit();
        }
    }, {
        key: "_vehiclesTakeTheSameLane",
        value: function _vehiclesTakeTheSameLane(vehicle, another_vehicle) {
            return vehicle.destinationExitLaneId() == another_vehicle.destinationExitLaneId();
        }
    }, {
        key: "_isOnMiddleLane",
        value: function _isOnMiddleLane(vehicle) {
            return !this._isOnOuterLane(vehicle);
        }
    }, {
        key: "_isOnOuterLane",
        value: function _isOnOuterLane(vehicle) {
            return vehicle.currentLaneId() + 1 == this._numberOfRoundaboutLanes;
        }
    }, {
        key: "_isOuterLane",
        value: function _isOuterLane(laneId) {
            return this._numberOfRoundaboutLanes - 1 == laneId;
        }
    }, {
        key: "_isMiddleLane",
        value: function _isMiddleLane(laneId) {
            if (this._numberOfRoundaboutLanes == 2 && laneId == 0) {
                return true;
            }
            if (this._numberOfRoundaboutLanes == 3 && laneId == 1) {
                return true;
            }
            return false;
        }
    }]);

    return ExitRules;
})();

var CurrentRules = (function (_ExitRules) {
    _inherits(CurrentRules, _ExitRules);

    function CurrentRules() {
        _classCallCheck(this, CurrentRules);

        _get(Object.getPrototypeOf(CurrentRules.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(CurrentRules, [{
        key: "possibleExitLanesFrom",
        value: function possibleExitLanesFrom(roundaboutLane) {
            if (this._isOuterLane(roundaboutLane)) {
                return [0, 1];
            }
            if (this._isMiddleLane(roundaboutLane)) {
                return [1];
            }
            return [];
        }
    }]);

    return CurrentRules;
})(ExitRules);

var SuggestedRules = (function (_ExitRules2) {
    _inherits(SuggestedRules, _ExitRules2);

    function SuggestedRules() {
        _classCallCheck(this, SuggestedRules);

        _get(Object.getPrototypeOf(SuggestedRules.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(SuggestedRules, [{
        key: "possibleExitLanesFrom",
        value: function possibleExitLanesFrom(roundaboutLane) {
            if (this._isOuterLane(roundaboutLane)) {
                return [0];
            }
            if (this._isMiddleLane(roundaboutLane)) {
                return [1];
            }
            return [];
        }
    }]);

    return SuggestedRules;
})(ExitRules);

var SuggestedRulesWithChangedRightOfWay = (function (_SuggestedRules) {
    _inherits(SuggestedRulesWithChangedRightOfWay, _SuggestedRules);

    function SuggestedRulesWithChangedRightOfWay() {
        _classCallCheck(this, SuggestedRulesWithChangedRightOfWay);

        _get(Object.getPrototypeOf(SuggestedRulesWithChangedRightOfWay.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(SuggestedRulesWithChangedRightOfWay, [{
        key: "shouldYieldTo",
        value: function shouldYieldTo(vehicle, another_vehicle) {
            if (this._vehiclesLeaveAtTheSameExit(vehicle, another_vehicle)) {
                return false;
            }
            return !this._isOnMiddleLane(vehicle);
        }
    }]);

    return SuggestedRulesWithChangedRightOfWay;
})(SuggestedRules);

exports.CurrentRules = CurrentRules;
exports.SuggestedRules = SuggestedRules;
exports.SuggestedRulesWithChangedRightOfWay = SuggestedRulesWithChangedRightOfWay;

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = (function () {
    function Path(entranceRoad, entranceLaneId, roundaboutLaneId, destinationExit, destinationExitLaneId) {
        _classCallCheck(this, Path);

        this._entranceRoad = entranceRoad;
        this._entranceLaneId = entranceLaneId;
        this._roundaboutLaneId = roundaboutLaneId;
        this._destinationExit = destinationExit;
        this._destinationExitLaneId = destinationExitLaneId;
    }

    _createClass(Path, [{
        key: "entranceRoadId",
        value: function entranceRoadId() {
            return this._entranceRoad.id();
        }
    }, {
        key: "entranceLaneId",
        value: function entranceLaneId() {
            return this._entranceLaneId;
        }
    }, {
        key: "roundaboutLaneId",
        value: function roundaboutLaneId() {
            return this._roundaboutLaneId;
        }
    }, {
        key: "destinationExit",
        value: function destinationExit() {
            return this._destinationExit.id();
        }
    }, {
        key: "destinationExitLaneId",
        value: function destinationExitLaneId() {
            return this._destinationExitLaneId;
        }
    }]);

    return Path;
})();

exports["default"] = Path;
module.exports = exports["default"];

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RandomNumberGenerator = (function () {
    function RandomNumberGenerator() {
        _classCallCheck(this, RandomNumberGenerator);
    }

    _createClass(RandomNumberGenerator, [{
        key: "intFromTo",
        value: function intFromTo(from, to) {
            return Math.floor(Math.random() * (to - from + 1)) + from;
        }
    }]);

    return RandomNumberGenerator;
})();

exports["default"] = RandomNumberGenerator;
module.exports = exports["default"];

},{}],17:[function(require,module,exports){
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
            return this._exitsLanes.concat(this._entrancesLanes);
        }
    }], [{
        key: 'newRoad',
        value: function newRoad(direction, length, laneWidth, entrancesLanesCount, exitLanesCount) {
            var entranceLanes = Array.from((0, _JsWhyYouNoImplementJs.range)(0, entrancesLanesCount), function (entranceNumber) {
                return new _LaneJs2['default'](direction.id() + '_ENTRANCE_' + entranceNumber, length, laneWidth, false);
            });
            entranceLanes.reverse();
            var exitLanes = Array.from((0, _JsWhyYouNoImplementJs.range)(0, exitLanesCount), function (exitNumber) {
                return new _LaneJs2['default'](direction.id() + '_EXIT_' + exitNumber, length, laneWidth, false);
            });

            return new AdherentRoad(direction, length, entranceLanes, exitLanes);
        }
    }]);

    return AdherentRoad;
})();

exports['default'] = AdherentRoad;
module.exports = exports['default'];

},{"../../JsWhyYouNoImplement.js":5,"./Lane.js":20}],18:[function(require,module,exports){
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
    }], [{
        key: "newNorth",
        value: function newNorth() {
            return new Direction("N");
        }
    }, {
        key: "newSouth",
        value: function newSouth() {
            return new Direction("S");
        }
    }, {
        key: "newEast",
        value: function newEast() {
            return new Direction("E");
        }
    }, {
        key: "newWest",
        value: function newWest() {
            return new Direction("W");
        }
    }]);

    return Direction;
})();

exports["default"] = Direction;
module.exports = exports["default"];

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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
            return 35; // 35 meters
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
    }, {
        key: 'laneIdToTheRightOf',
        value: function laneIdToTheRightOf(laneId) {
            if (this.lanesCount() == 2 && laneId == 0) {
                return 1;
            }
            if (this.lanesCount() == 3 && laneId == 0) {
                return 1;
            }
            if (this.lanesCount() == 3 && laneId == 1) {
                return 2;
            }
            return null;
        }
    }, {
        key: 'laneIdToTheLeftOf',
        value: function laneIdToTheLeftOf(laneId) {
            if (this.lanesCount() == 2 && laneId == 1) {
                return 0;
            }
            if (this.lanesCount() == 3 && laneId == 2) {
                return 1;
            }
            if (this.lanesCount() == 3 && laneId == 1) {
                return 0;
            }
            return null;
        }
    }, {
        key: 'entranceLaneIdToTheRightOf',
        value: function entranceLaneIdToTheRightOf(laneId) {
            if (laneId.includes("_ENTRANCE_1")) {
                return laneId.replace("_ENTRANCE_1", "_ENTRANCE_0");
            }
            return null;
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
exports.RoundaboutSpecification = RoundaboutSpecification;

},{"../../JsWhyYouNoImplement.js":5,"./AdherentRoad.js":17,"./Direction.js":18,"./InnerRoad.js":19,"./Lane.js":20}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vehicle = (function () {
    function Vehicle(lengthCells, maxSpeed, maxSpeedWhenTurning, drivingRules) {
        _classCallCheck(this, Vehicle);

        this._lengthCells = lengthCells;
        this._currentSpeed = 1;
        this._maxSpeed = maxSpeed;
        this._id = Math.round(Math.random() * 16777215);
        this._currentCells = [];
        this._maxSpeedWhenTurning = maxSpeedWhenTurning;
        this._drivingRules = drivingRules;
    }

    _createClass(Vehicle, [{
        key: "maxSpeedWhenTurning",
        value: function maxSpeedWhenTurning() {
            return this._maxSpeedWhenTurning;
        }
    }, {
        key: "currentSpeed",
        value: function currentSpeed() {
            return this._currentSpeed;
        }
    }, {
        key: "currentLaneId",
        value: function currentLaneId() {
            return this.frontCell().parentLane().id();
        }
    }, {
        key: "destinationExit",
        value: function destinationExit() {
            return this._path.destinationExit();
        }
    }, {
        key: "destinationExitLaneId",
        value: function destinationExitLaneId() {
            return this._path.destinationExitLaneId();
        }
    }, {
        key: "entranceLaneId",
        value: function entranceLaneId() {
            return this._path.entranceLaneId();
        }
    }, {
        key: "roundaboutLaneId",
        value: function roundaboutLaneId() {
            return this._path.roundaboutLaneId();
        }
    }, {
        key: "entranceRoadId",
        value: function entranceRoadId() {
            return this._path.entranceRoadId();
        }
    }, {
        key: "setPath",
        value: function setPath(path) {
            this._path = path;
        }
    }, {
        key: "moveToNextIteration",
        value: function moveToNextIteration(cellsMap, cellsNeighbours) {
            //Entering roundabout
            if (cellsNeighbours.approachedEntrance(this)) {
                this._onEntrance(cellsMap, cellsNeighbours);
                return;
            }

            //Taking exit
            if (cellsNeighbours.approachedDestinationExit(this)) {
                this._onExit(cellsMap);
                return;
            }

            if (!this._drivingRules.roundaboutRules.isOnRightOfWay()) {
                if (this._drivingRules.roundaboutRules.shouldYieldToVehicleOnTheLeft(cellsMap, cellsNeighbours, this) && cellsNeighbours.isApproachingAnyExit(this)) {
                    if (!cellsMap.nothingInFrontOf(this, this._currentSpeed + 1)) {
                        var breakUpTo = this._distanceFromPrecedingVehicle(cellsMap);
                        this._break(breakUpTo);
                    } else {
                        this._breakBy(1);
                    }

                    cellsMap.moveVehicleBy(this, this._currentSpeed);
                    return;
                }

                if (this._drivingRules.roundaboutRules.shouldYieldToVehicleOnTheLeft(cellsMap, cellsNeighbours, this) && cellsNeighbours.approachedAnyExit(this)) {
                    this._stop();
                    return;
                }
            }

            this._accelrateIfPossible(cellsMap, cellsNeighbours);
            this._keepSafeDistanceFromPrecedeeingVehicle(cellsMap);

            if (this._isApproachingExit(cellsNeighbours) || this._isApproachingRoundabout(cellsNeighbours)) {
                if (this.currentSpeed() > this.maxSpeedWhenTurning()) {
                    this._breakBy(1);
                }
            }
            cellsMap.moveVehicleBy(this, this._currentSpeed);
        }
    }, {
        key: "_accelrateIfPossible",
        value: function _accelrateIfPossible(cellsMap, cellsNeighbours) {
            if (cellsMap.nothingInFrontOf(this, this._currentSpeed + 1)) {
                if (!this._isApproachingExit(cellsNeighbours) && !this._isApproachingRoundabout(cellsNeighbours)) {
                    this._accelerate();
                }
            }
        }
    }, {
        key: "_keepSafeDistanceFromPrecedeeingVehicle",
        value: function _keepSafeDistanceFromPrecedeeingVehicle(cellsMap) {
            if (!cellsMap.nothingInFrontOf(this, this._currentSpeed + 1)) {
                var breakUpTo = this._distanceFromPrecedingVehicle(cellsMap);
                this._break(breakUpTo);
            }
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
        key: "isOnRoundabout",
        value: function isOnRoundabout() {
            return this.currentCells().every(function (cell) {
                return cell.parentLane().isRoundaboutLane();
            });
        }
    }, {
        key: "isEnteringRoundabout",
        value: function isEnteringRoundabout() {
            return this.currentCells().some(function (cell) {
                return cell.parentLane().isEntranceLane();
            });
        }
    }, {
        key: "_accelerate",
        value: function _accelerate() {
            var by = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

            if (this._currentSpeed + by < this._maxSpeed) {
                this._currentSpeed += by;
            } else {
                this._currentSpeed = this._maxSpeed;
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
            if (this._currentSpeed - by >= 0) {
                this._currentSpeed -= by;
            }
        }
    }, {
        key: "_stop",
        value: function _stop() {
            this._break(0);
        }
    }, {
        key: "_hasStopped",
        value: function _hasStopped() {
            return this._currentSpeed == 0;
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
    }, {
        key: "_isApproachingExit",
        value: function _isApproachingExit(cellsNeighbours) {
            return cellsNeighbours.isApproachingDestinationExit(this) && this.frontCell().parentLane().isRoundaboutLane();
        }
    }, {
        key: "_isApproachingRoundabout",
        value: function _isApproachingRoundabout(cellsNeighbours) {
            return cellsNeighbours.isApproachingRoundabout(this) && this.frontCell().parentLane().isEntranceLane();
        }
    }, {
        key: "_onEntrance",
        value: function _onEntrance(cellsMap, cellsNeighbours) {
            var vehiclesOnTheLeft = cellsMap.vehiclesOnTheLeft(this, cellsNeighbours);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = vehiclesOnTheLeft.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var vehicle = _step.value;

                    if (this._drivingRules.entranceRules.shouldYieldTo(this, vehicle)) {
                        this._stop();
                        return;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var vehicleOnTheRight = cellsMap.vehicleOnTheRight(this);
            if (vehicleOnTheRight && this._drivingRules.entranceRules.shouldYieldTo(this, vehicleOnTheRight)) {
                this._stop();
                return;
            }

            var firstCellOnRoundabout = cellsNeighbours.firstCellNumberOnEntrance(this.entranceRoadId(), this.entranceLaneId(), this.roundaboutLaneId());
            var nothingInFrontOnRoundabout = cellsMap.nothingOnRoundaboutFrom(this.roundaboutLaneId(), firstCellOnRoundabout, this.maxSpeedWhenTurning());
            if (this._hasStopped() && nothingInFrontOnRoundabout) {
                this._accelerate(this.maxSpeedWhenTurning());
            }
            if (this.currentSpeed() > this.maxSpeedWhenTurning()) {
                this._break(this.maxSpeedWhenTurning());
            }
            if (nothingInFrontOnRoundabout) {
                cellsMap.takeEntrance(this, cellsNeighbours);
            }
        }
    }, {
        key: "_onExit",
        value: function _onExit(cellsMap) {
            if (!cellsMap.exitLaneEmpty(this, this.maxSpeedWhenTurning())) {
                this._stop();
                return;
            }
            var vehicleOnTheRight = cellsMap.vehicleOnTheRight(this);
            if (vehicleOnTheRight && this._drivingRules.exitRules.shouldYieldTo(this, vehicleOnTheRight)) {
                this._stop();
            } else {
                if (this._hasStopped()) {
                    this._accelerate(this.maxSpeedWhenTurning());
                }
                cellsMap.takeExit(this);
            }
            return;
        }
    }]);

    return Vehicle;
})();

exports["default"] = Vehicle;
module.exports = exports["default"];

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _VehicleJs = require('./Vehicle.js');

var _VehicleJs2 = _interopRequireDefault(_VehicleJs);

var _SpecificationDirectionJs = require('./Specification/Direction.js');

var _SpecificationDirectionJs2 = _interopRequireDefault(_SpecificationDirectionJs);

var VehicleFactory = (function () {
    function VehicleFactory() {
        _classCallCheck(this, VehicleFactory);
    }

    _createClass(VehicleFactory, null, [{
        key: 'newCar',
        value: function newCar(drivingRules) {
            return new _VehicleJs2['default'](2, 5, 2, drivingRules);
        }
    }, {
        key: 'newMotorcycle',
        value: function newMotorcycle(drivingRules) {
            return new _VehicleJs2['default'](1, 5, 2, drivingRules);
        }
    }, {
        key: 'newVan',
        value: function newVan(drivingRules) {
            return new _VehicleJs2['default'](3, 5, 2, drivingRules);
        }
    }, {
        key: 'newMiniBus',
        value: function newMiniBus(drivingRules) {
            return new _VehicleJs2['default'](4, 3, 2, drivingRules);
        }
    }, {
        key: 'newBus',
        value: function newBus(drivingRules) {
            return new _VehicleJs2['default'](5, 2, 1, drivingRules);
        }
    }, {
        key: 'newTruck',
        value: function newTruck(drivingRules) {
            return new _VehicleJs2['default'](5, 2, 1, drivingRules);
        }
    }]);

    return VehicleFactory;
})();

exports['default'] = VehicleFactory;
module.exports = exports['default'];

},{"./Specification/Direction.js":18,"./Vehicle.js":22}],24:[function(require,module,exports){
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

var _SimulationDrivingRulesJs = require('./Simulation/DrivingRules.js');

var unitConverter = new _GUIUnitConverterJs2['default'](_SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe.roundaboutDiameter() + _SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe.adherentRoadLength() * 2, Math.min(window.innerWidth, window.innerHeight));

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

var cellsNeighbours = new _SimulationCellsNeighboursJs2['default'](roundaboutBukoweCellsMap.cellsCountsOnInnerRoadLanes(), _SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe.adherentLanesCount() / 2, unitConverter.metersAsCells(_SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe.adherentRoadLength()));

var drivingRules = _SimulationDrivingRulesJs.DrivingRules.newRules5(_SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe.lanesCount(), _SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe.adherentLanesCount());
var cellularAutomata = new _SimulationCellularAutomataJs2['default'](roundaboutBukoweCellsMap, cellsNeighbours, drivingRules, _SimulationSpecificationRoundaboutSpecificationsJs.roundaboutBukowe.adherentLanesCount() / 2, 0.5);

roundaboutDrawer.draw();
function nextIteration() {
    cellularAutomata.nextIteration();
    if (cellularAutomata.hasFinished()) {
        console.log("Finished simulation, ", cellularAutomata.iterations());
        return;
    }
    setTimeout(function () {
        nextIteration();
    }, 700);
};
nextIteration();

},{"./GUI/CellsDrawer.js":1,"./GUI/RoundaboutDrawer.js":2,"./GUI/Translator.js":3,"./GUI/UnitConverter.js":4,"./Simulation/CellsMap.js":8,"./Simulation/CellsNeighbours.js":9,"./Simulation/CellularAutomata.js":10,"./Simulation/DrivingRules.js":11,"./Simulation/Specification/RoundaboutSpecifications.js":21}]},{},[24]);
