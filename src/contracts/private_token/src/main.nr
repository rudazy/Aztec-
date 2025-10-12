contract PrivateToken {
    use dep::aztec::prelude::*;

    #[aztec(storage)]
    struct Storage {
        admin: PublicMutable<AztecAddress>,
        total_supply: PublicMutable<Field>,
    }

    #[aztec(public)]
    #[aztec(initializer)]
    fn constructor(admin: AztecAddress, initial_supply: Field) {
        storage.admin.write(admin);
        storage.total_supply.write(initial_supply);
    }

    #[aztec(public)]
    fn get_total_supply() -> Field {
        storage.total_supply.read()
    }
}
