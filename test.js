// Generated by CoffeeScript 1.9.2
(function() {
  var COLS, DOWN, EMPTY, FRUIT, KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_UP, LEFT, RIGHT, ROWS, SNAKE, UP, canvas, ctx, draw, frames, gameloop, grid, highscore, init, keystate, main, score, setFood, snake, update;

  COLS = 26;

  ROWS = 26;

  EMPTY = 0;

  SNAKE = 1;

  FRUIT = 2;

  LEFT = 0;

  UP = 1;

  RIGHT = 2;

  DOWN = 3;

  KEY_LEFT = 37;

  KEY_UP = 38;

  KEY_RIGHT = 39;

  KEY_DOWN = 40;

  canvas = null;

  ctx = null;

  keystate = null;

  frames = null;

  score = null;

  highscore = 0;

  grid = {
    width: null,
    height: null,
    _grid: null,
    init: function(d, c, r) {
      var i, ref, results, x, y;
      this.width = c;
      this.height = r;
      this._grid = [];
      results = [];
      for (x = i = 0, ref = c; i <= ref; x = i += 1) {
        this._grid.push([]);
        results.push((function() {
          var j, ref1, results1;
          results1 = [];
          for (y = j = 0, ref1 = r; j <= ref1; y = j += 1) {
            results1.push(this._grid[x].push(d));
          }
          return results1;
        }).call(this));
      }
      return results;
    },
    set: function(val, x, y) {
      return this._grid[x][y] = val;
    },
    get: function(x, y) {
      return this._grid[x][y];
    }
  };

  snake = {
    direction: null,
    last: null,
    _queue: null,
    init: function(d, x, y) {
      this.direction = d;
      this._queue = [];
      return this.insert(x, y);
    },
    insert: function(x, y) {
      this._queue.unshift({
        x: x,
        y: y
      });
      return this.last = this._queue[0];
    },
    remove: function() {
      return this._queue.pop();
    }
  };

  setFood = function() {
    var empty, i, j, randpos, ref, ref1, x, y;
    empty = [];
    for (x = i = 0, ref = grid.width - 1; i <= ref; x = i += 1) {
      for (y = j = 0, ref1 = grid.height - 1; j <= ref1; y = j += 1) {
        if (grid.get(x, y) === EMPTY) {
          empty.push({
            x: x,
            y: y
          });
        }
      }
    }
    randpos = empty[Math.floor(Math.random() * empty.length)];
    return grid.set(FRUIT, randpos.x, randpos.y);
  };

  main = function() {
    canvas = document.createElement("canvas");
    canvas.width = COLS * 20;
    canvas.height = ROWS * 20;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    ctx.font = "bold 15px Calibri";
    frames = 0;
    keystate = {};
    document.addEventListener("keydown", function(evt) {
      return keystate[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function(evt) {
      return keystate[evt.keyCode] = false;
    });
    init();
    return gameloop();
  };

  init = function() {
    var sp;
    if (score > highscore) {
      highscore = score;
    }
    score = 0;
    grid.init(EMPTY, COLS, ROWS);
    sp = {
      x: Math.floor(COLS / 2),
      y: ROWS - 1
    };
    snake.init(UP, sp.x, sp.y);
    grid.set(SNAKE, sp.x, sp.y);
    return setFood();
  };

  gameloop = function() {
    update();
    draw();
    return window.requestAnimationFrame(gameloop, canvas);
  };

  update = function() {
    var nx, ny, tail;
    frames++;
    if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
      snake.direction = LEFT;
    }
    if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
      snake.direction = RIGHT;
    }
    if (keystate[KEY_UP] && snake.direction !== DOWN) {
      snake.direction = UP;
    }
    if (keystate[KEY_DOWN] && snake.direction !== UP) {
      snake.direction = DOWN;
    }
    if (frames % 5 === 0) {
      nx = snake.last.x;
      ny = snake.last.y;
      switch (snake.direction) {
        case LEFT:
          nx--;
          break;
        case UP:
          ny--;
          break;
        case RIGHT:
          nx++;
          break;
        case DOWN:
          ny++;
      }
      if (nx < 0 || nx > grid.width - 1 || ny < 0 || ny > grid.height - 1 || grid.get(nx, ny) === SNAKE) {
        return init();
      }
      if (grid.get(nx, ny) === FRUIT) {
        tail = {
          x: nx,
          y: ny
        };
        score++;
        setFood();
      } else {
        tail = snake.remove();
        grid.set(EMPTY, tail.x, tail.y);
        tail.x = nx;
        tail.y = ny;
      }
      grid.set(SNAKE, tail.x, tail.y);
      return snake.insert(tail.x, tail.y);
    }
  };

  draw = function() {
    var i, j, ref, ref1, th, tw, x, y;
    tw = canvas.width / grid.width;
    th = canvas.height / grid.height;
    for (x = i = 0, ref = grid.width - 1; i <= ref; x = i += 1) {
      for (y = j = 0, ref1 = grid.height - 1; j <= ref1; y = j += 1) {
        switch (grid.get(x, y)) {
          case EMPTY:
            ctx.fillStyle = "#fff";
            break;
          case SNAKE:
            ctx.fillStyle = "#0f0";
            break;
          case FRUIT:
            ctx.fillStyle = "#f00";
        }
        ctx.fillRect(x * tw, y * th, tw, th);
      }
    }
    ctx.fillStyle = "#000";
    ctx.fillText("HIGHSCORE: " + highscore, 10, 20);
    return ctx.fillText("SCORE: " + score, 10, canvas.height - 10);
  };

  main();

}).call(this);
