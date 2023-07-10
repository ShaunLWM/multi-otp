import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { accountCollectionRef } from "../lib/Firebase";

export const useAccounts = () => {
  return useFirestoreQueryData<AccountWithId, { tags: string[], accounts: AccountWithId[] }>(["products"], accountCollectionRef, { subscribe: true }, {
    select: (snapshot) => {
      const tags = new Set<string>();
      tags.add("All");
      snapshot.forEach((doc) => {
        if (doc.tag) {
          tags.add(doc.tag.toLowerCase());
        }
      })

      return {
        tags: Array.from(tags),
        accounts: snapshot
      }
    }
  });
}
