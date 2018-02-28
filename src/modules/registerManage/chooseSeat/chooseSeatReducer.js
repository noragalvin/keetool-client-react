import {
    TOGGLE_CHOOSE_SEAT_MODAL,
    CHOOSE_SEAT_LOAD_ROOMS_SUCCESS,
    CHOOSE_SEAT_BEGIN_LOAD_ROOMS,
    CHOOSE_SEAT_SET_ACTIVE_ROOM,
    CHOOSE_SEAT_LOAD_SEATS_SUCCESS,
} from "./chooseSeatActionType";

const initialState = {
    from: "",
    to: "",
    showModal: false,
    base: {},
    isLoading: false,
    rooms: [],
    isLoadingSeats: false,
    seats: [],
    seatsCount: 0,
    availableSeats: 0,
    bookedSeats: [],
};

export default function chooseSeatReducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_CHOOSE_SEAT_MODAL:
            return {
                ...state,
                showModal: action.showModal,
                base: action.base,
            };
        case CHOOSE_SEAT_BEGIN_LOAD_ROOMS:
            return {
                ...state,
                isLoading: true,
            };
        case CHOOSE_SEAT_LOAD_ROOMS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                rooms: action.rooms,
            };
        case CHOOSE_SEAT_LOAD_SEATS_SUCCESS:
            return {
                ...state,
                isLoadingSeats: false,
                seats: action.seats,
                seatsCount: action.seatsCount,
                availableSeats: action.availableSeats,
                bookedSeats: action.bookedSeats,
            };
        case CHOOSE_SEAT_SET_ACTIVE_ROOM:
            return {
                ...state,
                isLoadingSeats: true,
                rooms: state.rooms.map(room => {
                    if (room.id === action.roomId) {
                        return {
                            ...room,
                            isActive: true,
                        };
                    }
                    return {
                        ...room,
                        isActive: false,
                    };
                }),
            };
        default:
            return state;
    }
}
