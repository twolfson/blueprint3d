namespace BP3D.Items {
  /** Enumeration of item types. */
  const item_types = {
  };

  /** Factory class to create items. */
  export class Factory {
    /** Gets the class for the specified item. */
    public static getClass(itemType) { 
      return item_types[itemType]
    }
  }
}