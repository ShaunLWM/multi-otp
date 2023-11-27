import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { accountCollectionRef } from "../lib/Firebase";

export const useAccounts = () => {
  return useFirestoreQueryData<AccountWithId, { tags: string[], accounts: AccountWithId[] }>(["products"], accountCollectionRef, { subscribe: true }, {
    select: (snapshot) => {
      const tags = new Set<string>();
      tags.add("All");
      snapshot.forEach((doc) => {
        if (doc.tag && Array.isArray(doc.tag) && doc.tag.length > 0) {
          doc.tag.forEach(item => tags.add(item))
        }
      })

      return {
        tags: Array.from(tags),
        accounts: snapshot.sort((a, b) => a.email.localeCompare(b.email))
      }
    }
  });
}
