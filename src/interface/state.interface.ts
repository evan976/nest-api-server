export enum PublishState {
  Publish = 1,
  Draft = 0,
}

export enum OriginState {
  Original = 0,
  Reprint = 1,
  Hybrid = 2,
}

export enum CommentState {
  Auditing = 0,
  Published = 1,
  Recycled = -1,
}

export enum Weights {
  Large = 3,
  Medium = 2,
  Small = 1,
}
