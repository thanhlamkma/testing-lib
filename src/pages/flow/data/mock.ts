export const tempData = {
  vertices: [
    {
      id: 'VA03',
      description: 'Display Sales Orders',
      lang: 'E'
    },
    {
      id: 'VA02',
      description: 'Change Sales Orders',
      lang: 'E'
    },
    {
      id: 'VL01N',
      description: 'Create Outbound Dlv. with Order Ref.',
      lang: 'E'
    },
    {
      id: 'ME23N',
      description: 'Display Purchase Order',
      lang: 'E'
    },
    {
      id: 'MB51',
      description: 'Material Doc. List',
      lang: 'E'
    },
    {
      id: 'ZSDESSP0011',
      description: null,
      lang: null
    },
    {
      id: 'ME22N',
      description: 'Change Purchase Order',
      lang: 'E'
    },
    {
      id: 'MT_SD0039_ERP',
      description: null,
      lang: null
    },
    {
      id: 'MT_MM2062_ERP',
      description: null,
      lang: null
    },
    {
      id: 'S',
      description: 'Start',
      lang: 'E'
    },
    {
      id: 'E',
      description: 'End',
      lang: 'E'
    }
  ],
  edges: [
    {
      source: 'VA03',
      target: 'VA02',
      durationAvg: null
    },
    {
      source: 'VA02',
      target: 'VL01N',
      durationAvg: null
    },
    {
      source: 'VL01N',
      target: 'MT_SD0039_ERP',
      durationAvg: null
    },
    {
      source: 'ME23N',
      target: 'MT_MM2062_ERP',
      durationAvg: null
    },
    {
      source: 'VA02',
      target: 'VA03',
      durationAvg: null
    },
    {
      source: 'VA03',
      target: 'ME23N',
      durationAvg: null
    },
    {
      source: 'MB51',
      target: 'VA02',
      durationAvg: null
    },
    {
      source: 'VA03',
      target: 'MT_MM2062_ERP',
      durationAvg: null
    },
    {
      source: 'MB51',
      target: 'VA03',
      durationAvg: null
    },
    {
      source: 'VL01N',
      target: 'VA03',
      durationAvg: null
    },
    {
      source: 'ME23N',
      target: 'VA03',
      durationAvg: null
    },
    {
      source: 'VA02',
      target: 'MT_SD0039_ERP',
      durationAvg: null
    },
    {
      source: 'VA02',
      target: 'ZSDESSP0011',
      durationAvg: null
    },
    {
      source: 'ZSDESSP0011',
      target: 'VA03',
      durationAvg: null
    },
    {
      source: 'ME22N',
      target: 'VA03',
      durationAvg: null
    },
    {
      source: 'VA02',
      target: 'ME23N',
      durationAvg: null
    },
    {
      source: 'S',
      target: 'MB51',
      durationAvg: null
    },
    {
      source: 'S',
      target: 'VA02',
      durationAvg: null
    },
    {
      source: 'S',
      target: 'VA03',
      durationAvg: null
    },
    {
      source: 'S',
      target: 'ME23N',
      durationAvg: null
    },
    {
      source: 'S',
      target: 'ME22N',
      durationAvg: null
    },
    {
      source: 'MT_MM2062_ERP',
      target: 'E',
      durationAvg: null
    },
    {
      source: 'VA02',
      target: 'E',
      durationAvg: null
    },
    {
      source: 'VA03',
      target: 'E',
      durationAvg: null
    },
    {
      source: 'MT_SD0039_ERP',
      target: 'E',
      durationAvg: null
    },
    {
      source: 'ZSDESSP0011',
      target: 'E',
      durationAvg: null
    }
  ]
};

export const highlightData = {
  patternId: '150258b8f7dccd8e1bcaccb5bd8963e9d3b49d6adf152dc1d47b7cbed8734342',
  pattern: ['S', 'VA03', 'VA02', 'E'],
  vertices: [
    {
      id: 'S',
      description: 'Start',
      lang: 'E'
    },
    {
      id: 'VA03',
      description: 'Display Sales Orders',
      lang: 'E'
    },
    {
      id: 'VA02',
      description: 'Change Sales Orders',
      lang: 'E'
    },
    {
      id: 'E',
      description: 'End',
      lang: 'E'
    }
  ],
  edges: [
    {
      source: 'S',
      target: 'VA03',
      durationAvg: null
    },
    {
      source: 'VA03',
      target: 'VA02',
      durationAvg: 374.89
    },
    {
      source: 'VA02',
      target: 'E',
      durationAvg: null
    }
  ]
};

export const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input' },
    position: { x: 0, y: 0 }
  },
  {
    id: '2',
    data: { label: 'node 2' },
    position: { x: 0, y: 100 }
  },
  {
    id: '2a',
    data: { label: 'node 2a' },
    position: { x: 0, y: 200 }
  },
  {
    id: '2b',
    data: { label: 'node 2b' },
    position: { x: 0, y: 300 }
  },
  {
    id: '2c',
    data: { label: 'node 2c' },
    position: { x: 0, y: 400 }
  },
  {
    id: '2d',
    data: { label: 'node 2d' },
    position: { x: 0, y: 500 }
  },
  {
    id: '3',
    data: { label: 'node 3' },
    position: { x: 200, y: 100 }
  }
];

export const initialEdges = [
  { id: 'e12', source: '1', target: '2', animated: true },
  { id: 'e13', source: '1', target: '3', animated: true },
  { id: 'e22a', source: '2', target: '2a', animated: true },
  { id: 'e22b', source: '2', target: '2b', animated: true },
  { id: 'e22c', source: '2', target: '2c', animated: true },
  { id: 'e2c2d', source: '2c', target: '2d', animated: true }
];
