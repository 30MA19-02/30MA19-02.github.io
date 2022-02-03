import data.complex.exponential
import data.real.sign

noncomputable theory

namespace model

  variable k : ℝ

  namespace trig
    def f (trig : ℝ → ℝ)(hypr : ℝ → ℝ) :=
      if k ≥ 0 then
        λ θ: ℝ, trig (k * θ)
      else
        λ θ: ℝ, hypr (k * θ)

    def fast (trig : ℝ → ℝ)(hypr : ℝ → ℝ) :=
      if k ≥ 0 then
        λ θ: ℝ, trig (k * θ)
      else
        λ θ: ℝ, hypr (-k * θ)

    def sin := f k real.sin real.sinh
    def cos := f k real.cos real.cosh
    def sinast := fast k real.sin real.sinh
    def cosast := fast k real.cos real.cosh

    @[simp]
    lemma sin_at_zero (θ: ℝ):
        sin 0 θ = 0
      :=
      begin
        rwa [sin, f],
        simp,
      end

    @[simp]
    lemma cos_at_zero (θ: ℝ):
        cos 0 θ = 1
      :=
      begin
        rw [cos, f],
        simp,
      end

    @[simp]
    lemma sinast_as_sin (θ: ℝ):
        sinast k θ = (real.sign k) * (sin k θ)
      :=
      begin
        rw [sinast, fast],
        rw [sin, f],
        simp,
        sorry,
      end
      -- proof by cases

    @[simp]
    lemma cosast_as_cos (θ: ℝ):
        cosast k θ = cos k θ
      :=
      begin
        rw [cosast, fast],
        rw [cos, f],
        simp,
      end

    lemma pytagorean_iden (θ: ℝ) : 
        (cos k θ)^2 + (real.sign k) * (sin k θ)^2 = 1
      :=
      begin
        rw [cos, sin, f],
        simp,
        sorry,
        -- proof by cases
      end

    lemma sin_sum (θ: ℝ)(φ: ℝ) : 
        sin k (θ+φ) = (sin k θ) * (cos k φ) + (cos k θ) * (sin k φ)
      :=
      sorry
      -- proof by cases

    lemma sinast_sum (θ: ℝ)(φ: ℝ) : 
        sinast k (θ+φ) = (sinast k θ) * (cos k φ) + (cos k θ) * (sinast k φ)
      :=
      begin
        simp,
        rw mul_comm (cos k θ) (k.sign * sin k φ),
        sorry
        -- if k = 0, 0 = 0 * 1 + 1 * 0
        -- else *1/k.sign
      end

    lemma cos_sum (θ: ℝ)(φ: ℝ) : 
        cos k (θ+φ) = (cos k θ) * (cos k φ) + (real.sign k) * (sin k θ) * (sin k φ)
      :=
      sorry
      -- proof by cases
  end trig
end model
