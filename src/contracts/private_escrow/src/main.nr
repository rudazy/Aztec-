contract PrivateEscrow {
    use dep::aztec::prelude::*;

    #[aztec(storage)]
    struct Storage {
        admin: PublicMutable<AztecAddress>,
    }

    #[aztec(public)]
    #[aztec(initializer)]
    fn constructor(admin: AztecAddress) {
        storage.admin.write(admin);
    }

    #[aztec(public)]
    fn get_admin() -> AztecAddress {
        storage.admin.read()
    }
}
