export const MapUtil = {
    // 1 - 10 state points
    // 11 - 20 county points
    createClusterPoints: function (points) {
        const result = { // {1-10 : states, 11-20: points}
            total: 0
        };
        if (!points) {
            return result;
        }
        const states = {}; // {state,info}
        for (const point of points) {
            result.total += point.stats.confirmed;

            states[point.province] = states[point.province] || {
                confirmed: 0,
                deaths: 0
            };

            states[point.province].confirmed += point.stats.confirmed;
            states[point.province].deaths += point.stats.deaths;
            states[point.province].coordinates = point.coordinates;
        }
        for (let i = 1; i <= 8; i++) {
            result[i] = states;
        }

        for (let i = 9; i <= 20; i++) {
            result[i] = points;
        }
        return result;
    },

    inBoundary: function (coordinates, bounds) {
        return coordinates && bounds && bounds.nw && bounds.se && ((coordinates.longitude >= bounds.nw.lng && coordinates.longitude <= bounds.se.lng) || (coordinates.longitude <= bounds.nw.lng && coordinates.longitude >= bounds.se.lng))
            && ((coordinates.latitude >= bounds.se.lat && coordinates.latitude <= bounds.nw.lat) || (coordinates.latitude <= bounds.se.lat && coordinates.latitude >= bounds.nw.lat));
    }

};