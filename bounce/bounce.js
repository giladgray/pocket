(function() {
  var GRAVITY, pocket, start;

  pocket = new Pocket;

  pocket.component('context-2d', function(cmp, options) {
    var resize;
    cmp.canvas = document.querySelector(options.canvas || '#canvas');
    cmp.g2d = cmp.canvas.getContext('2d');
    cmp.center = {
      x: 0,
      y: 0
    };
    window.addEventListener('resize', resize = function() {
      cmp.canvas.width = document.body.clientWidth;
      cmp.canvas.height = document.body.clientHeight;
      cmp.width = cmp.canvas.width;
      cmp.height = cmp.canvas.height;
      cmp.center.x = cmp.canvas.width / 2;
      return cmp.center.y = cmp.canvas.height / 2;
    });
    return resize();
  });

  pocket.key({
    'context-2d': null
  });

  pocket.component('position', {
    x: 0,
    y: 0
  });

  pocket.component('velocity', {
    x: 0,
    y: 0
  });

  pocket.component('circle', {
    radius: 30,
    color: 'red'
  });

  pocket.key({
    position: {
      x: 30,
      y: 50
    },
    velocity: {
      x: 5,
      y: 0
    },
    circle: null
  });

  GRAVITY = 1.0;

  pocket.systemForEach('gravity', ['velocity'], function(pocket, key, vel) {
    return vel.y += GRAVITY;
  });

  pocket.systemForEach('move', ['position', 'velocity'], function(pocket, key, pos, vel) {
    pos.x += vel.x;
    return pos.y += vel.y;
  });

  pocket.system('clear-canvas', [], function(pocket) {
    var g2d, height, width, _ref;
    _ref = pocket.getData('context-2d'), g2d = _ref.g2d, width = _ref.width, height = _ref.height;
    return g2d.clearRect(0, 0, width, height);
  });

  pocket.systemForEach('draw-ball', ['position', 'circle'], function(pocket, key, pos, circle) {
    var g2d;
    g2d = pocket.getData('context-2d').g2d;
    g2d.beginPath();
    g2d.fillStyle = circle.color;
    g2d.arc(pos.x, pos.y, circle.radius, 0, Math.PI * 2);
    g2d.closePath();
    return g2d.fill();
  });

  pocket.systemForEach('bounce', ['position', 'velocity', 'circle'], function(pkt, key, pos, vel, _arg) {
    var height, radius, width, _ref;
    radius = _arg.radius;
    _ref = pkt.getData('context-2d'), width = _ref.width, height = _ref.height;
    if (pos.x < radius || pos.x > width - radius) {
      vel.x *= -1;
      pos.x += vel.x;
    }
    if (pos.y < radius || pos.y > height - radius) {
      vel.y *= -1;
      return pos.y += vel.y;
    }
  });

  start = function(time) {
    pocket.tick(time);
    return window.requestAnimationFrame(start);
  };

  document.addEventListener('DOMContentLoaded', function() {
    return start();
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvdW5jZS9ib3VuY2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzQkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxHQUFBLENBQUEsTUFBVCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsWUFBakIsRUFBK0IsU0FBQyxHQUFELEVBQU0sT0FBTixHQUFBO0FBQzdCLFFBQUEsTUFBQTtBQUFBLElBQUEsR0FBRyxDQUFDLE1BQUosR0FBYSxRQUFRLENBQUMsYUFBVCxDQUF1QixPQUFPLENBQUMsTUFBUixJQUFrQixTQUF6QyxDQUFiLENBQUE7QUFBQSxJQUNBLEdBQUcsQ0FBQyxHQUFKLEdBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFYLENBQXNCLElBQXRCLENBRFYsQ0FBQTtBQUFBLElBRUEsR0FBRyxDQUFDLE1BQUosR0FBYTtBQUFBLE1BQUMsQ0FBQSxFQUFHLENBQUo7QUFBQSxNQUFPLENBQUEsRUFBRyxDQUFWO0tBRmIsQ0FBQTtBQUFBLElBS0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLE1BQUEsR0FBUyxTQUFBLEdBQUE7QUFDekMsTUFBQSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQVgsR0FBbUIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFqQyxDQUFBO0FBQUEsTUFDQSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQVgsR0FBb0IsUUFBUSxDQUFDLElBQUksQ0FBQyxZQURsQyxDQUFBO0FBQUEsTUFFQSxHQUFHLENBQUMsS0FBSixHQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FGdkIsQ0FBQTtBQUFBLE1BR0EsR0FBRyxDQUFDLE1BQUosR0FBYSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BSHhCLENBQUE7QUFBQSxNQUlBLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBWCxHQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBWCxHQUFtQixDQUpsQyxDQUFBO2FBS0EsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFYLEdBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFYLEdBQW9CLEVBTk07SUFBQSxDQUEzQyxDQUxBLENBQUE7V0FZQSxNQUFBLENBQUEsRUFiNkI7RUFBQSxDQUEvQixDQUhBLENBQUE7O0FBQUEsRUFtQkEsTUFBTSxDQUFDLEdBQVAsQ0FBVztBQUFBLElBQUMsWUFBQSxFQUFjLElBQWY7R0FBWCxDQW5CQSxDQUFBOztBQUFBLEVBc0JBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFVBQWpCLEVBQTZCO0FBQUEsSUFBQyxDQUFBLEVBQUcsQ0FBSjtBQUFBLElBQU8sQ0FBQSxFQUFHLENBQVY7R0FBN0IsQ0F0QkEsQ0FBQTs7QUFBQSxFQXVCQSxNQUFNLENBQUMsU0FBUCxDQUFpQixVQUFqQixFQUE2QjtBQUFBLElBQUMsQ0FBQSxFQUFHLENBQUo7QUFBQSxJQUFPLENBQUEsRUFBRyxDQUFWO0dBQTdCLENBdkJBLENBQUE7O0FBQUEsRUF3QkEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsUUFBakIsRUFBNkI7QUFBQSxJQUFDLE1BQUEsRUFBUSxFQUFUO0FBQUEsSUFBYSxLQUFBLEVBQU8sS0FBcEI7R0FBN0IsQ0F4QkEsQ0FBQTs7QUFBQSxFQTJCQSxNQUFNLENBQUMsR0FBUCxDQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVc7QUFBQSxNQUFDLENBQUEsRUFBRyxFQUFKO0FBQUEsTUFBUSxDQUFBLEVBQUcsRUFBWDtLQUFYO0FBQUEsSUFDQSxRQUFBLEVBQVc7QUFBQSxNQUFDLENBQUEsRUFBRyxDQUFKO0FBQUEsTUFBTyxDQUFBLEVBQUcsQ0FBVjtLQURYO0FBQUEsSUFFQSxNQUFBLEVBQVcsSUFGWDtHQURGLENBM0JBLENBQUE7O0FBQUEsRUFpQ0EsT0FBQSxHQUFVLEdBakNWLENBQUE7O0FBQUEsRUFrQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsU0FBckIsRUFBZ0MsQ0FBQyxVQUFELENBQWhDLEVBQThDLFNBQUMsTUFBRCxFQUFTLEdBQVQsRUFBYyxHQUFkLEdBQUE7V0FDNUMsR0FBRyxDQUFDLENBQUosSUFBUyxRQURtQztFQUFBLENBQTlDLENBbENBLENBQUE7O0FBQUEsRUFzQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsTUFBckIsRUFBNkIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQUE3QixFQUF1RCxTQUFDLE1BQUQsRUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixHQUFuQixHQUFBO0FBQ3JELElBQUEsR0FBRyxDQUFDLENBQUosSUFBUyxHQUFHLENBQUMsQ0FBYixDQUFBO1dBQ0EsR0FBRyxDQUFDLENBQUosSUFBUyxHQUFHLENBQUMsRUFGd0M7RUFBQSxDQUF2RCxDQXRDQSxDQUFBOztBQUFBLEVBMkNBLE1BQU0sQ0FBQyxNQUFQLENBQWMsY0FBZCxFQUE4QixFQUE5QixFQUFrQyxTQUFDLE1BQUQsR0FBQTtBQUNoQyxRQUFBLHdCQUFBO0FBQUEsSUFBQSxPQUF1QixNQUFNLENBQUMsT0FBUCxDQUFlLFlBQWYsQ0FBdkIsRUFBQyxXQUFBLEdBQUQsRUFBTSxhQUFBLEtBQU4sRUFBYSxjQUFBLE1BQWIsQ0FBQTtXQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixLQUFwQixFQUEyQixNQUEzQixFQUZnQztFQUFBLENBQWxDLENBM0NBLENBQUE7O0FBQUEsRUFnREEsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsV0FBckIsRUFBa0MsQ0FBQyxVQUFELEVBQWEsUUFBYixDQUFsQyxFQUEwRCxTQUFDLE1BQUQsRUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixNQUFuQixHQUFBO0FBQ3hELFFBQUEsR0FBQTtBQUFBLElBQUMsTUFBTyxNQUFNLENBQUMsT0FBUCxDQUFlLFlBQWYsRUFBUCxHQUFELENBQUE7QUFBQSxJQUNBLEdBQUcsQ0FBQyxTQUFKLENBQUEsQ0FEQSxDQUFBO0FBQUEsSUFFQSxHQUFHLENBQUMsU0FBSixHQUFnQixNQUFNLENBQUMsS0FGdkIsQ0FBQTtBQUFBLElBR0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxHQUFHLENBQUMsQ0FBWixFQUFlLEdBQUcsQ0FBQyxDQUFuQixFQUFzQixNQUFNLENBQUMsTUFBN0IsRUFBcUMsQ0FBckMsRUFBd0MsSUFBSSxDQUFDLEVBQUwsR0FBVSxDQUFsRCxDQUhBLENBQUE7QUFBQSxJQUlBLEdBQUcsQ0FBQyxTQUFKLENBQUEsQ0FKQSxDQUFBO1dBS0EsR0FBRyxDQUFDLElBQUosQ0FBQSxFQU53RDtFQUFBLENBQTFELENBaERBLENBQUE7O0FBQUEsRUF5REEsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsUUFBckIsRUFBK0IsQ0FBQyxVQUFELEVBQWEsVUFBYixFQUF5QixRQUF6QixDQUEvQixFQUFtRSxTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixJQUFyQixHQUFBO0FBQ2pFLFFBQUEsMkJBQUE7QUFBQSxJQUR1RixTQUFELEtBQUMsTUFDdkYsQ0FBQTtBQUFBLElBQUEsT0FBa0IsR0FBRyxDQUFDLE9BQUosQ0FBWSxZQUFaLENBQWxCLEVBQUMsYUFBQSxLQUFELEVBQVEsY0FBQSxNQUFSLENBQUE7QUFDQSxJQUFBLElBQUcsR0FBRyxDQUFDLENBQUosR0FBUSxNQUFSLElBQWtCLEdBQUcsQ0FBQyxDQUFKLEdBQVEsS0FBQSxHQUFRLE1BQXJDO0FBQ0UsTUFBQSxHQUFHLENBQUMsQ0FBSixJQUFTLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxHQUFHLENBQUMsQ0FBSixJQUFTLEdBQUcsQ0FBQyxDQURiLENBREY7S0FEQTtBQUlBLElBQUEsSUFBRyxHQUFHLENBQUMsQ0FBSixHQUFRLE1BQVIsSUFBa0IsR0FBRyxDQUFDLENBQUosR0FBUSxNQUFBLEdBQVMsTUFBdEM7QUFDRSxNQUFBLEdBQUcsQ0FBQyxDQUFKLElBQVMsQ0FBQSxDQUFULENBQUE7YUFDQSxHQUFHLENBQUMsQ0FBSixJQUFTLEdBQUcsQ0FBQyxFQUZmO0tBTGlFO0VBQUEsQ0FBbkUsQ0F6REEsQ0FBQTs7QUFBQSxFQW1FQSxLQUFBLEdBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixJQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixDQUFBLENBQUE7V0FDQSxNQUFNLENBQUMscUJBQVAsQ0FBNkIsS0FBN0IsRUFGTTtFQUFBLENBbkVSLENBQUE7O0FBQUEsRUF1RUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxTQUFBLEdBQUE7V0FBRyxLQUFBLENBQUEsRUFBSDtFQUFBLENBQTlDLENBdkVBLENBQUE7QUFBQSIsImZpbGUiOiJib3VuY2UvYm91bmNlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsicG9ja2V0ID0gbmV3IFBvY2tldFxuXG4jIGNvbnRleHQtMmQgY29tcG9uZW50IGZvciBzdG9yaW5nIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBhbmQgb3RoZXIgY2FudmFzIGluZm9cbnBvY2tldC5jb21wb25lbnQgJ2NvbnRleHQtMmQnLCAoY21wLCBvcHRpb25zKSAtPlxuICBjbXAuY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciBvcHRpb25zLmNhbnZhcyBvciAnI2NhbnZhcydcbiAgY21wLmcyZCA9IGNtcC5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICBjbXAuY2VudGVyID0ge3g6IDAsIHk6IDB9XG5cbiAgIyBlbnN1cmUgY2FudmFzIGlzIGFzIGxhcmdlIGFzIHBvc3NpYmxlXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCByZXNpemUgPSAtPlxuICAgIGNtcC5jYW52YXMud2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoXG4gICAgY21wLmNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodFxuICAgIGNtcC53aWR0aCA9IGNtcC5jYW52YXMud2lkdGhcbiAgICBjbXAuaGVpZ2h0ID0gY21wLmNhbnZhcy5oZWlnaHRcbiAgICBjbXAuY2VudGVyLnggPSBjbXAuY2FudmFzLndpZHRoIC8gMlxuICAgIGNtcC5jZW50ZXIueSA9IGNtcC5jYW52YXMuaGVpZ2h0IC8gMlxuICByZXNpemUoKVxuXG4jIHRoZSBjb250ZXh0LTJkIGRhdGEgb2JqZWN0XG5wb2NrZXQua2V5IHsnY29udGV4dC0yZCc6IG51bGx9XG5cbiMgYmFsbCBjb21wb25lbnRzXG5wb2NrZXQuY29tcG9uZW50ICdwb3NpdGlvbicsIHt4OiAwLCB5OiAwfVxucG9ja2V0LmNvbXBvbmVudCAndmVsb2NpdHknLCB7eDogMCwgeTogMH1cbnBvY2tldC5jb21wb25lbnQgJ2NpcmNsZScsICAge3JhZGl1czogMzAsIGNvbG9yOiAncmVkJ31cblxuIyB0aGUgYmFsbCFcbnBvY2tldC5rZXlcbiAgcG9zaXRpb24gOiB7eDogMzAsIHk6IDUwfVxuICB2ZWxvY2l0eSA6IHt4OiA1LCB5OiAwfVxuICBjaXJjbGUgICA6IG51bGxcblxuIyBhcHBseSBncmF2aXR5IHRvIGV2ZXJ5IHRoaW5nIHdpdGggYSB2ZWxvY2l0eVxuR1JBVklUWSA9IDEuMFxucG9ja2V0LnN5c3RlbUZvckVhY2ggJ2dyYXZpdHknLCBbJ3ZlbG9jaXR5J10sIChwb2NrZXQsIGtleSwgdmVsKSAtPlxuICB2ZWwueSArPSBHUkFWSVRZXG5cbiMgbW92ZSBlYWNoIGJhbGxcbnBvY2tldC5zeXN0ZW1Gb3JFYWNoICdtb3ZlJywgWydwb3NpdGlvbicsICd2ZWxvY2l0eSddLCAocG9ja2V0LCBrZXksIHBvcywgdmVsKSAtPlxuICBwb3MueCArPSB2ZWwueFxuICBwb3MueSArPSB2ZWwueVxuXG4jIGNsZWFyIHRoZSBjYW52YXMgZWFjaCBmcmFtZVxucG9ja2V0LnN5c3RlbSAnY2xlYXItY2FudmFzJywgW10sIChwb2NrZXQpIC0+XG4gIHtnMmQsIHdpZHRoLCBoZWlnaHR9ID0gcG9ja2V0LmdldERhdGEgJ2NvbnRleHQtMmQnXG4gIGcyZC5jbGVhclJlY3QgMCwgMCwgd2lkdGgsIGhlaWdodFxuXG4jIGRyYXcgZWFjaCBiYWxsc1xucG9ja2V0LnN5c3RlbUZvckVhY2ggJ2RyYXctYmFsbCcsIFsncG9zaXRpb24nLCAnY2lyY2xlJ10sIChwb2NrZXQsIGtleSwgcG9zLCBjaXJjbGUpIC0+XG4gIHtnMmR9ID0gcG9ja2V0LmdldERhdGEgJ2NvbnRleHQtMmQnXG4gIGcyZC5iZWdpblBhdGgoKVxuICBnMmQuZmlsbFN0eWxlID0gY2lyY2xlLmNvbG9yXG4gIGcyZC5hcmMgcG9zLngsIHBvcy55LCBjaXJjbGUucmFkaXVzLCAwLCBNYXRoLlBJICogMlxuICBnMmQuY2xvc2VQYXRoKClcbiAgZzJkLmZpbGwoKVxuXG4jIGJvdW5jZSBlYWNoIGJhbGwgd2hlbiB0aGV5IHJlYWNoIHRoZSBlZGdlIG9mIHRoZSBjYW52YXNcbnBvY2tldC5zeXN0ZW1Gb3JFYWNoICdib3VuY2UnLCBbJ3Bvc2l0aW9uJywgJ3ZlbG9jaXR5JywgJ2NpcmNsZSddLCAocGt0LCBrZXksIHBvcywgdmVsLCB7cmFkaXVzfSkgLT5cbiAge3dpZHRoLCBoZWlnaHR9ID0gcGt0LmdldERhdGEgJ2NvbnRleHQtMmQnXG4gIGlmIHBvcy54IDwgcmFkaXVzIG9yIHBvcy54ID4gd2lkdGggLSByYWRpdXNcbiAgICB2ZWwueCAqPSAtMVxuICAgIHBvcy54ICs9IHZlbC54XG4gIGlmIHBvcy55IDwgcmFkaXVzIG9yIHBvcy55ID4gaGVpZ2h0IC0gcmFkaXVzXG4gICAgdmVsLnkgKj0gLTFcbiAgICBwb3MueSArPSB2ZWwueVxuXG4jIHJlbmRlciBsb29wXG5zdGFydCA9ICh0aW1lKSAtPlxuICBwb2NrZXQudGljayh0aW1lKVxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHN0YXJ0XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ0RPTUNvbnRlbnRMb2FkZWQnLCAtPiBzdGFydCgpXG4iXX0=