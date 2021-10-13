export class Planet {

    // public static names: string[] = [
    //     '0', '1', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Staturn', 'Uranus', 'Neptune',
    //     'Pluto', 'Mean node', 'True node'
    // ];

    public static names: string[] = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8',
        '9', '10', '11'
    ];

    /**
     * The planet name
     * @type {string}
     */
    name: string;

    /**
     * A planet's longitude
     * @type {number}
     */
    longitude: number;

    /**
     * A planet's latitude
     * @type {number}
     */
    latitude: number;

    /**
     * A planet's speed
     * @type {number}
     */
    speed: number;

    /**
     * Instantiate a new planet object.
     * @param {string} name The planet's name
     * @param {number} lon  The planet's longitude
     * @param {number} lat  The planet's latitude
     * @param {number} spd  The planet's speed relative to earth
     */
    constructor(name: string, lon: number, lat: number, spd: number) {
        this.name = name;
        this.longitude = lon;
        this.latitude = lat;
        this.speed = spd;
    }

    /**
     * A planet is retrograde when it's speed relative
     * to earth is less than zero
     * @return {boolean} Whether or not the planet is retrograde
     */
    get retrograde(): boolean {
        return this.speed < 0;
    }

    get house(): number {
        return Math.floor(this.longitude / 30);
    }

    get position(): string {
        const value = this.longitude - this.house * 30;
        const hour = Math.floor(value);
        const minFrac = (value - hour) * 60;
        const min = Math.floor(minFrac);
        const sec = Math.floor((minFrac - min) * 60);
        return hour + ' ' + min + ' ' + sec;
    }

    /**
     * Is this one of the major planets typically included in a chart?
     * @return {boolean} Returns true if it is a major planet
     */
    isMajor(): boolean {
        return ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn",
            "uranus", "neptune", "pluto", "north node", "south node"]
            .indexOf(this.name.toLowerCase()) > -1;
    }
}

export default Planet

export interface SourceryPlanetData {
    longitude: number;
    longitudeSpeed: number;
    latitude: number;
    latitudeSpeed: number;
    distance: number;
    distanceSpeed: number;
}