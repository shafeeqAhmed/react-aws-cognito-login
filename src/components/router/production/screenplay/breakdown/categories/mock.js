// @flow
/* eslint-disable import/prefer-default-export */
export const categories = [
  {
    id: "1BnOOf3tU0rdVA0vxCROWmAA967",
    version: 1,
    productionId: "2",
    name: "CAST MEMBERS",
    color: "blue",
    type: "custom",
    createdBy: "50393f98-fe11-47e9-a237-8ecde9b02690",
    createdAt: "2018-10-19T13:22:47Z",
    updatedAt: "2018-10-19T13:22:47Z",
    deletedAt: null,
    elements: [
      {
        id: "1BnOPUCxYcOcKQSLtV7ERB7lOuH",
        version: 2,
        productionId: "2",
        name: "Norma Carroll",
        categoryId: "1BnOPP0mFjRXIY5Ec5rmsULWkjN",
        relatedId: "",
        shootingeventsScenes: [
          {
            shootingeventId: "1BnOPRcUYAtu2gBDUvHzjibkxkW",
            sceneId: "1BnOPQitvxzQheWCjxDwhiTq7HW",
            shootingeventName: "2. INT. STAN'S APARTMENT - DAY",
            setId: "1BnOPQW1BjWM19TIupMB5iwFyBt",
            setName: "Stan's Apartment",
            screenplayId: "1BnOPTGmGjM7cMn3mWLwHnykwu9",
            sceneTitle: "INT. STAN'S APARTMENT - DAY",
            sceneSequence: 2
          }
        ],
        vendorId: "1BnOPUtPQbytdXv5PXeWq2F7Lzn",
        vendorName: "Walmart",
        dueDate: null,
        status: "identified",
        tags: null,
        createdBy: "50393f98-fe11-47e9-a237-8ecde9b02690",
        createdAt: "2018-10-19T13:22:52Z",
        updatedAt: "2018-10-19T13:22:52Z",
        deletedAt: null
      },
      {
        id: "1BnOPOoXXWU9PBp1a1KkmzecI1K",
        version: 1,
        productionId: "2",
        name: "William Hernandez",
        categoryId: "1BnOPP0mFjRXIY5Ec5rmsULWkjN",
        relatedId: "askdnlkjsanfdskjf123",
        shootingeventsScenes: [],
        vendorId: null,
        vendorName: null,
        dueDate: null,
        status: "identified",
        tags: null,
        createdBy: "50393f98-fe11-47e9-a237-8ecde9b02690",
        createdAt: "2018-10-19T13:22:52Z",
        updatedAt: "2018-10-19T13:22:52Z",
        deletedAt: null
      }
    ]
  },
  {
    id: "1BnOOjpMmGjCXcVfkp4NEEaszjq",
    version: 1,
    productionId: "2",
    name: "EXTRAS",
    color: "red",
    type: "custom",
    createdBy: "50393f98-fe11-47e9-a237-8ecde9b02690",
    createdAt: "2018-10-19T13:22:47Z",
    updatedAt: "2018-10-19T13:22:47Z",
    deletedAt: null,
    elements: [
      {
        id: "1BnOPUCxYcOcKQSLtV7ERB7lOuH",
        version: 2,
        productionId: "2",
        name: "Norma Carroll",
        categoryId: "1BnOPP0mFjRXIY5Ec5rmsULWkjN",
        relatedId: "1BnOPP0asdklmXIY5Ec5rmsULWkjN",
        shootingeventsScenes: [
          {
            shootingeventId: "1BnOPRcUYAtu2gBDUvHzjibkxkW",
            sceneId: "1BnOPQitvxzQheWCjxDwhiTq7HW",
            shootingeventName: "2. INT. STAN'S APARTMENT - DAY",
            setId: "1BnOPQW1BjWM19TIupMB5iwFyBt",
            setName: "Stan's Apartment",
            screenplayId: "1BnOPTGmGjM7cMn3mWLwHnykwu9",
            sceneTitle: "INT. STAN'S APARTMENT - DAY",
            sceneSequence: 2
          }
        ],
        vendorId: "1BnOPUtPQbytdXv5PXeWq2F7Lzn",
        vendorName: "Walmart",
        dueDate: null,
        status: "identified",
        tags: null,
        createdBy: "50393f98-fe11-47e9-a237-8ecde9b02690",
        createdAt: "2018-10-19T13:22:52Z",
        updatedAt: "2018-10-19T13:22:52Z",
        deletedAt: null
      },
      {
        id: "1BnOPOoXXWU9PBp1a1KkmzecI1K",
        version: 1,
        productionId: "2",
        name: "William Hernandez",
        categoryId: "1BnOPP0mFjRXIY5Ec5rmsULWkjN",
        relatedId: "",
        shootingeventsScenes: [],
        vendorId: null,
        vendorName: null,
        dueDate: null,
        status: "identified",
        tags: null,
        createdBy: "50393f98-fe11-47e9-a237-8ecde9b02690",
        createdAt: "2018-10-19T13:22:52Z",
        updatedAt: "2018-10-19T13:22:52Z",
        deletedAt: null
      }
    ]
  }
];

export type Element = {
  id: string,
  version: number,
  productionId: string,
  name: string,
  categoryId: string,
  relatedId: string,
  shootingeventsScenes: Array<{
    shootingeventId: string,
    sceneId: string,
    shootingeventName: string,
    setId: string,
    setName: string,
    screenplayId: string,
    sceneTitle: string,
    sceneSequence: number
  }>,
  vendorId: ?string,
  vendorName: ?string,
  dueDate: ?string,
  status: string,
  tags: ?string,
  createdBy: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: ?string
};

export type Category = {
  id: string,
  version: number,
  productionId: string,
  name: string,
  color: string,
  type: string,
  createdBy: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: ?string,
  elements: Array<Element>
};

// export const elements = [
//   {
//     id: "1BnOPUCxYcOcKQSLtV7ERB7lOuH",
//     version: 2,
//     productionId: "2",
//     name: "Norma Carroll",
//     categoryId: "1BnOPP0mFjRXIY5Ec5rmsULWkjN",
//     relatedId: "",
//     shootingeventsScenes: [
//       {
//         shootingeventId: "1BnOPRcUYAtu2gBDUvHzjibkxkW",
//         sceneId: "1BnOPQitvxzQheWCjxDwhiTq7HW",
//         shootingeventName: "2. INT. STAN'S APARTMENT - DAY",
//         setId: "1BnOPQW1BjWM19TIupMB5iwFyBt",
//         setName: "Stan's Apartment",
//         screenplayId: "1BnOPTGmGjM7cMn3mWLwHnykwu9",
//         sceneTitle: "INT. STAN'S APARTMENT - DAY",
//         sceneSequence: 2
//       }
//     ],
//     vendorId: "1BnOPUtPQbytdXv5PXeWq2F7Lzn",
//     vendorName: "Walmart",
//     dueDate: null,
//     status: "identified",
//     tags: null,
//     createdBy: "50393f98-fe11-47e9-a237-8ecde9b02690",
//     createdAt: "2018-10-19T13:22:52Z",
//     updatedAt: "2018-10-19T13:22:52Z",
//     deletedAt: null
//   },
//   {
//     id: "1BnOPOoXXWU9PBp1a1KkmzecI1K",
//     version: 1,
//     productionId: "2",
//     name: "William Hernandez",
//     categoryId: "1BnOPP0mFjRXIY5Ec5rmsULWkjN",
//     relatedId: "",
//     shootingeventsScenes: [],
//     vendorId: null,
//     vendorName: null,
//     dueDate: null,
//     status: "identified",
//     tags: null,
//     createdBy: "50393f98-fe11-47e9-a237-8ecde9b02690",
//     createdAt: "2018-10-19T13:22:52Z",
//     updatedAt: "2018-10-19T13:22:52Z",
//     deletedAt: null
//   }
// ]
