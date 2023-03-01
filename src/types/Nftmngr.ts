interface DisplayOption {
  bool_true_value: string;
  bool_false_value: string;
  opensea: {
    display_type: string;
    trait_type: string;
    max_value: string;
  };
}

interface OriginAttribute {
  name: string;
  data_type: string;
  required: boolean;
  display_value_field: string;
  display_option: DisplayOption;
  default_mint_value: null;
  hidden_to_marketplace: false;
  index: string;
}

interface NumberDefaultMintValue {
  number_attribute_value: {
    value: string;
  };
}

interface StringDefaultMintValue {
  string_attribute_value: {
    value: string;
  };
}

interface BooleanDefaultMintValue {
  boolean_attribute_value: {
    value: boolean;
  };
}

interface FloatDefaultMintValue {
  float_attribute_value: {
    value: string;
  };
}

interface OnchainAttribute {
  name: string;
  data_type: string;
  required: boolean;
  display_value_field: string;
  display_option: DisplayOption;
  default_mint_value:
    | NumberDefaultMintValue
    | StringDefaultMintValue
    | BooleanDefaultMintValue;
  hidden_to_marketplace: boolean;
  index: string;
}

export interface Schema {
  code: string;
  name: string;
  owner: string;
  system_actioners: string[];
  origin_data: {
    origin_chain: string;
    origin_contract_address: string;
    origin_base_uri: string;
    attribute_overriding: string;
    metadata_format: string;
    origin_attributes: OriginAttribute[];
    uri_retrieval_method: "BASE" | "TOKEN";
  };
  onchain_data: {
    reveal_required: true;
    reveal_secret: null;
    nft_attributes: [];
    token_attributes: OnchainAttribute[];
    actions: [
      {
        name: "check_in";
        desc: "Check In";
        disable: false;
        when: "meta.GetBoolean('checked_in') == false";
        then: [
          "meta.SetBoolean('checked_in', true)",
          "meta.SetNumber('missions_completed', meta.GetNumber('missions_completed') + 1)",
          "meta.SetNumber('points', meta.GetNumber('points') + 200)"
        ];
        allowed_actioner: "ALLOWED_ACTIONER_ALL";
        params: [];
      },
      {
        name: "claim_bonus_1";
        desc: "Claim Bonus 1";
        disable: false;
        when: "meta.GetBoolean('bonus_1') == false";
        then: [
          "meta.SetBoolean('bonus_1', true)",
          "meta.SetNumber('points', meta.GetNumber('points') + 200)"
        ];
        allowed_actioner: "ALLOWED_ACTIONER_ALL";
        params: [];
      },
      {
        name: "claim_bonus_2";
        desc: "Claim Bonus 2";
        disable: false;
        when: "meta.GetBoolean('bonus_2') == false";
        then: [
          "meta.SetBoolean('bonus_2', true)",
          "meta.SetNumber('points', meta.GetNumber('points') + 200)"
        ];
        allowed_actioner: "ALLOWED_ACTIONER_ALL";
        params: [];
      },
      {
        name: "redeem_200";
        desc: "Redeem gift for 200 points";
        disable: false;
        when: "meta.GetBoolean('redeemed') == false && meta.GetNumber('points') >= 200 && meta.GetBoolean('transformed') == false && meta.GetNumber('missions_completed') == 2";
        then: [
          "meta.SetBoolean('redeemed', true)",
          "meta.SetNumber('points', meta.GetNumber('points') - 200)",
          "meta.SetNumber('missions_completed', meta.GetNumber('missions_completed') + 1)",
          "meta.SetBoolean('transformed', true)",
          "meta.SetImage(meta.ReplaceAllString(meta.GetImage(),'.png','-t.png'))"
        ];
        allowed_actioner: "ALLOWED_ACTIONER_ALL";
        params: [];
      },
      {
        name: "redeem_400";
        desc: "Redeem gift for 400 points";
        disable: false;
        when: "meta.GetBoolean('redeemed') == false && meta.GetNumber('points') >= 400 && meta.GetBoolean('transformed') == false && meta.GetNumber('missions_completed') == 2";
        then: [
          "meta.SetBoolean('redeemed', true)",
          "meta.SetNumber('points', meta.GetNumber('points') - 400)",
          "meta.SetNumber('missions_completed', meta.GetNumber('missions_completed') + 1)",
          "meta.SetBoolean('transformed', true)",
          "meta.SetImage(meta.ReplaceAllString(meta.GetImage(),'.png','-t.png'))"
        ];
        allowed_actioner: "ALLOWED_ACTIONER_ALL";
        params: [];
      },
      {
        name: "redeem_600";
        desc: "Redeem gift for 600 points";
        disable: false;
        when: "meta.GetBoolean('redeemed') == false && meta.GetNumber('points') >= 600 && meta.GetBoolean('transformed') == false && meta.GetNumber('missions_completed') == 2";
        then: [
          "meta.SetBoolean('redeemed', true)",
          "meta.SetNumber('points', meta.GetNumber('points') - 600)",
          "meta.SetNumber('missions_completed', meta.GetNumber('missions_completed') + 1)",
          "meta.SetBoolean('transformed', true)",
          "meta.SetImage(meta.ReplaceAllString(meta.GetImage(),'.png','-t.png'))"
        ];
        allowed_actioner: "ALLOWED_ACTIONER_ALL";
        params: [];
      }
    ];
    status: [];
    nft_attributes_value: [];
  };
  isVerified: false;
  mint_authorization: "system";
}
