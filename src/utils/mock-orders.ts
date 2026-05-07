export type TOrderStatus = 'done' | 'pending' | 'created';

export type TOrder = {
  _id: string;
  number: number;
  name: string;
  status: TOrderStatus;
  createdAt: string;
  updatedAt: string;
  ingredients: string[];
};

export const mockOrders: TOrder[] = [
  {
    _id: '1',
    number: 34535,
    name: 'Death Star Starship Main бургер',
    status: 'pending',
    createdAt: '2024-01-20T13:20:00.000Z',
    updatedAt: '2024-01-20T13:20:00.000Z',
    ingredients: [
      '60d3b41abdacab0026a733c6',
      '60d3b41abdacab0026a733c8',
      '60d3b41abdacab0026a733cb',
      '60d3b41abdacab0026a733cc',
      '60d3b41abdacab0026a733cd',
    ],
  },
  {
    _id: '2',
    number: 34534,
    name: 'Interstellar бургер',
    status: 'created',
    createdAt: '2024-01-20T10:20:00.000Z',
    updatedAt: '2024-01-20T10:20:00.000Z',
    ingredients: [
      '60d3b41abdacab0026a733c6',
      '60d3b41abdacab0026a733c8',
      '60d3b41abdacab0026a733cb',
      '60d3b41abdacab0026a733cc',
      '60d3b41abdacab0026a733cd',
      '60d3b41abdacab0026a733c9',
    ],
  },
  {
    _id: '3',
    number: 34533,
    name: 'Black Hole Singularity острый бургер',
    status: 'done',
    createdAt: '2024-01-19T10:50:00.000Z',
    updatedAt: '2024-01-19T10:50:00.000Z',
    ingredients: [
      '60d3b41abdacab0026a733c6',
      '60d3b41abdacab0026a733c6',
      '60d3b41abdacab0026a733c8',
      '60d3b41abdacab0026a733cd',
      '60d3b41abdacab0026a733c9',
    ],
  },
  {
    _id: '4',
    number: 34532,
    name: 'Supernova Infinity бургер',
    status: 'done',
    createdAt: '2024-01-18T18:53:00.000Z',
    updatedAt: '2024-01-18T18:53:00.000Z',
    ingredients: [
      '60d3b41abdacab0026a733c6',
      '60d3b41abdacab0026a733c7',
      '60d3b41abdacab0026a733cd',
      '60d3b41abdacab0026a733c9',
    ],
  },
  {
    _id: '5',
    number: 34530,
    name: 'Space флюоресцентный бургер',
    status: 'done',
    createdAt: '2024-01-17T12:10:00.000Z',
    updatedAt: '2024-01-17T12:10:00.000Z',
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c6'],
  },
];
