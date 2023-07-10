type Account = {
  email: string;
  secret: string;
  tag?: string;
}

type AccountWithId = Account & {
  id: string;
}
